<?php

namespace App\Services;

use App\Models\Opd;
use App\Models\SubElement;
use App\Models\Indicator;
use App\Models\SpipAssessment;
use Illuminate\Support\Facades\DB;

class SpipCalculator
{
    /**
     * Calculate the statistical Mode for a list of grades (A-E)
     * Ties are broken in the order: E > D > C > B > A (as in the Excel sheets)
     */
    public static function calculateMode(array $grades): ?string
    {
        if (empty($grades)) {
            return null;
        }

        // Clean grades
        $grades = array_map('strtoupper', array_filter($grades));
        if (empty($grades)) {
            return null;
        }

        // Frequency count
        $counts = array_count_values($grades);

        // Tie breaking order: E first, then D, C, B, A
        $order = ['E', 'D', 'C', 'B', 'A'];
        
        $bestGrade = null;
        $maxCount = -1;

        foreach ($order as $grade) {
            $count = $counts[$grade] ?? 0;
            if ($count > $maxCount) {
                $maxCount = $count;
                $bestGrade = $grade;
            }
        }

        return $bestGrade;
    }

    /**
     * Map Grade letter to score (A=5, B=4, C=3, D=2, E=1)
     */
    public static function gradeToScore(?string $grade): float
    {
        if (!$grade) return 0.0;
        $map = [
            'A' => 5.0,
            'B' => 4.0,
            'C' => 3.0,
            'D' => 2.0,
            'E' => 1.0,
        ];
        return $map[strtoupper($grade)] ?? 0.0;
    }

    /**
     * Compute SPIP Maturity, MRI, and IEPK Index for a given fiscal year
     */
    public static function calculateAll($fiscalYear): array
    {
        // 1. Calculate Penetapan Tujuan (40% weight)
        // Kualitas Sasaran (KKE 1.1) and Kualitas Strategi (KKE 1.2)
        // Usually evaluated using Yes/No (1/0) values.
        // We calculate the average compliance rate.
        $kke11Rate = self::getKkeComplianceRate('KKE_1.1', $fiscalYear);
        $kke12Rate = self::getKkeComplianceRate('KKE_1.2', $fiscalYear);

        $kke11Score = self::complianceRateToScore($kke11Rate);
        $kke12Score = self::complianceRateToScore($kke12Rate);

        $penetapanTujuanScore = 0.5 * $kke11Score + 0.5 * $kke12Score;
        $weightedPenetapanTujuan = 0.4 * $penetapanTujuanScore;

        // 2. Calculate Struktur & Proses (30% weight)
        // Compiled from 25 sub-elements in KK3.1-3.4 (T1, T2, T3, T4 objectives)
        $subElementScores = [];
        $subElements = SubElement::where('type', 'SPIP')->with('indicators')->get();

        foreach ($subElements as $sub) {
            $indicatorAverages = [];
            foreach ($sub->indicators as $indicator) {
                // For each indicator, get the mode of OPD grades for T1, T2, T3, T4
                $tScores = [];
                foreach (['T1', 'T2', 'T3', 'T4'] as $t) {
                    $opdGrades = SpipAssessment::where('indicator_id', $indicator->id)
                        ->where('fiscal_year', $fiscalYear)
                        ->where('target_objective', $t)
                        ->where(function ($query) {
                            $query->whereNotNull('grade_final_inspektorat')
                                  ->orWhereNotNull('grade_bappeda_verified')
                                  ->orWhereNotNull('grade_self_opd');
                        })
                        ->get()
                        ->map(function ($assessment) {
                            return $assessment->grade_final_inspektorat 
                                ?? $assessment->grade_bappeda_verified 
                                ?? $assessment->grade_self_opd;
                        })
                        ->toArray();

                    $modeGrade = self::calculateMode($opdGrades);
                    if ($modeGrade) {
                        $tScores[] = self::gradeToScore($modeGrade);
                    }
                }

                // Average of T1-T4 for this indicator
                if (!empty($tScores)) {
                    $indicatorAverages[] = array_sum($tScores) / count($tScores);
                } else {
                    $indicatorAverages[] = 0.0;
                }
            }

            // Sub-element score is the average of its indicators
            $subElementScores[$sub->code] = !empty($indicatorAverages) 
                ? array_sum($indicatorAverages) / count($indicatorAverages) 
                : 0.0;
        }

        // Apply weights for the 5 components of Struktur & Proses:
        // - Lingkungan Pengendalian (1.1 - 1.8): 8 sub-elements, 30% weight
        $lingkunganCodes = ['1.1', '1.2', '1.3', '1.4', '1.5', '1.6', '1.7', '1.8'];
        $lingkunganScore = self::averageOfCodes($subElementScores, $lingkunganCodes);

        // - Penilaian Risiko (2.1 - 2.2): 2 sub-elements, 20% weight
        $risikoCodes = ['2.1', '2.2'];
        $risikoScore = self::averageOfCodes($subElementScores, $risikoCodes);

        // - Kegiatan Pengendalian (3.1 - 3.11): 11 sub-elements, 25% weight
        $kegiatanCodes = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7', '3.8', '3.9', '3.10', '3.11'];
        $kegiatanScore = self::averageOfCodes($subElementScores, $kegiatanCodes);

        // - Informasi & Komunikasi (4.1 - 4.2): 2 sub-elements, 10% weight
        $infokomCodes = ['4.1', '4.2'];
        $infokomScore = self::averageOfCodes($subElementScores, $infokomCodes);

        // - Pemantauan (5.1 - 5.2): 2 sub-elements, 15% weight
        $pemantauanCodes = ['5.1', '5.2'];
        $pemantauanScore = self::averageOfCodes($subElementScores, $pemantauanCodes);

        $strukturProsesScore = (0.30 * $lingkunganScore) + 
                               (0.20 * $risikoScore) + 
                               (0.25 * $kegiatanScore) + 
                               (0.10 * $infokomScore) + 
                               (0.15 * $pemantauanScore);
        $weightedStrukturProses = 0.3 * $strukturProsesScore;

        // 3. Calculate Pencapaian Hasil (30% weight)
        // Query the regional results seeded for the PEMDA OPD
        $pemdaOpd = Opd::where('code_opd', 'OPD_PEMDA')->first();
        $pemdaOpdId = $pemdaOpd ? $pemdaOpd->id : 0;

        $hasilScores = [
            'outcome' => self::getHasilScore('KK_5.1_A', $pemdaOpdId, $fiscalYear),
            'output' => self::getHasilScore('KK_5.1_B', $pemdaOpdId, $fiscalYear),
            'opini_lk' => self::getHasilScore('KK_6', $pemdaOpdId, $fiscalYear),
            'pengamanan' => self::getHasilScore('KK_7', $pemdaOpdId, $fiscalYear),
            'ketaatan' => self::getHasilScore('KK_8', $pemdaOpdId, $fiscalYear),
        ];

        // Pencapaian Hasil weights:
        // Outcome: 20%
        // Output: 10%
        // Opini LK: 25%
        // Pengamanan: 25%
        // Ketaatan: 20%
        $pencapaianHasilScore = (0.20 * $hasilScores['outcome']) + 
                                (0.10 * $hasilScores['output']) + 
                                (0.25 * $hasilScores['opini_lk']) + 
                                (0.25 * $hasilScores['pengamanan']) + 
                                (0.20 * $hasilScores['ketaatan']);
        $weightedPencapaianHasil = 0.3 * $pencapaianHasilScore;

        // 4. SPIP Maturity Index (Sum of three components)
        $spipMaturity = $weightedPenetapanTujuan + $weightedStrukturProses + $weightedPencapaianHasil;

        // 5. Calculate Management Risk Index (MRI)
        // Perencanaan (40%), Kapabilitas (30%), Hasil (30%)
        $mriPerencanaan = $kke11Score; // Sasaran Strategis Pemda
        $mriKapabilitas = (0.05 / 0.3 * ($subElementScores['1.1'] ?? 0.0)) + 
                          (0.05 / 0.3 * ($subElementScores['1.2'] ?? 0.0)) + 
                          (0.05 / 0.3 * ($subElementScores['1.3'] ?? 0.0)) + 
                          (0.025 / 0.3 * ($subElementScores['1.8'] ?? 0.0)) + 
                          (0.125 / 0.3 * ($subElementScores['3.9'] ?? 0.0)); // Processes/Controls
        $mriHasil = (0.1875 / 0.3 * $lingkunganScore) + (0.1125 / 0.3 * $hasilScores['outcome']);
        
        $mriIndex = (0.4 * $mriPerencanaan) + (0.3 * $mriKapabilitas) + (0.3 * $mriHasil);

        // 6. Calculate Indeks Efektivitas Pencegahan Korupsi (IEPK)
        // Kapabilitas (48%), Penerapan (36%), Penanganan (16%)
        // Sub-elements mapping from SPIP indicators or dedicated IEPK questions
        $iepkKapabilitas = 0.0;
        $iepkPenerapan = 0.0;
        $iepkPenanganan = 0.0;
        // In the database, we can seed sub-elements of type IEPK to make this calculation simple!
        // We will sum the scores of the IEPK type sub-elements:
        $iepkSubScores = [];
        $iepkSubs = SubElement::where('type', 'IEPK')->with('indicators')->get();
        foreach ($iepkSubs as $sub) {
            $scores = [];
            foreach ($sub->indicators as $ind) {
                $grades = SpipAssessment::where('indicator_id', $ind->id)
                    ->where('fiscal_year', $fiscalYear)
                    ->get()
                    ->map(fn($a) => $a->grade_final_inspektorat ?? $a->grade_bappeda_verified ?? $a->grade_self_opd)
                    ->toArray();
                $mode = self::calculateMode($grades);
                if ($mode) {
                    $scores[] = self::gradeToScore($mode);
                }
            }
            $iepkSubScores[$sub->code] = !empty($scores) ? array_sum($scores) / count($scores) : 0.0;
        }

        // Standard IEPK formulas:
        // Kapabilitas: Kebijakan (9.6%), Regulasi (7.2%), SDM (7.2%), Power (14.4%), Pembelajaran (9.6%)
        $iepkKapabilitas = (0.096 * ($iepkSubScores['IEPK_1.1'] ?? 3.0)) + 
                           (0.072 * ($iepkSubScores['IEPK_1.2'] ?? 3.0)) + 
                           (0.072 * ($iepkSubScores['IEPK_1.3'] ?? 3.0)) + 
                           (0.144 * ($iepkSubScores['IEPK_1.4'] ?? 3.0)) + 
                           (0.096 * ($iepkSubScores['IEPK_1.5'] ?? 3.0));
        // Penerapan: Asesmen (9%), Whistleblowing (3.6%), Kepemimpinan Etis (9%), Integritas (7.2%), Iklim Etis (7.2%)
        $iepkPenerapan = (0.090 * ($iepkSubScores['IEPK_2.1'] ?? 3.0)) + 
                         (0.036 * ($iepkSubScores['IEPK_2.2'] ?? 3.0)) + 
                         (0.090 * ($iepkSubScores['IEPK_2.3'] ?? 3.0)) + 
                         (0.072 * ($iepkSubScores['IEPK_2.4'] ?? 3.0)) + 
                         (0.072 * ($iepkSubScores['IEPK_2.5'] ?? 3.0));
        // Penanganan: Investigasi (8%), Tindakan Korektif (8%)
        $iepkPenanganan = (0.080 * ($iepkSubScores['IEPK_3.1'] ?? 3.0)) + 
                          (0.080 * ($iepkSubScores['IEPK_3.2'] ?? 3.0));

        $iepkIndex = $iepkKapabilitas + $iepkPenerapan + $iepkPenanganan;

        return [
            'spip_maturity' => round($spipMaturity, 3),
            'mri_index' => round($mriIndex, 3),
            'iepk_index' => round($iepkIndex, 3),
            'components' => [
                'penetapan_tujuan' => round($penetapanTujuanScore, 3),
                'struktur_proses' => round($strukturProsesScore, 3),
                'pencapaian_hasil' => round($pencapaianHasilScore, 3),
                
                // Detailed Struktur & Proses components
                'lingkungan' => round($lingkunganScore, 3),
                'risiko' => round($risikoScore, 3),
                'kegiatan' => round($kegiatanScore, 3),
                'infokom' => round($infokomScore, 3),
                'pemantauan' => round($pemantauanScore, 3),
            ],
            'hasil' => [
                'outcome' => round($hasilScores['outcome'], 3),
                'output' => round($hasilScores['output'], 3),
                'opini_lk' => round($hasilScores['opini_lk'], 3),
                'pengamanan' => round($hasilScores['pengamanan'], 3),
                'ketaatan' => round($hasilScores['ketaatan'], 3),
            ],
            'iepk' => [
                'kapabilitas' => round($iepkKapabilitas, 3),
                'penerapan' => round($iepkPenerapan, 3),
                'penanganan' => round($iepkPenanganan, 3),
            ],
            'sub_elements' => $subElementScores
        ];
    }

    private static function getKkeComplianceRate(string $type, $fiscalYear): float
    {
        // Calculate fraction of 'Y' answers in KKE assessments
        $results = SpipAssessment::where('status_flow', '!=', 'DELETED')
            ->where('fiscal_year', $fiscalYear)
            ->whereHas('indicator.subElement', function ($q) use ($type) {
                $q->where('code', $type);
            })
            ->get();

        if ($results->isEmpty()) {
            return 1.0; // Default to 100% compliance if no records (to match sheet defaults)
        }

        $yCount = $results->filter(function ($a) {
            $grade = $a->grade_final_inspektorat ?? $a->grade_bappeda_verified ?? $a->grade_self_opd;
            return strtoupper($grade) === 'Y';
        })->count();

        return $yCount / $results->count();
    }

    private static function complianceRateToScore(float $rate): float
    {
        // 90% -> 5, 80% -> 4, 70% -> 3, 60% -> 2, else -> 1
        if ($rate > 0.90) return 5.0;
        if ($rate > 0.80) return 4.0;
        if ($rate > 0.70) return 3.0;
        if ($rate > 0.60) return 2.0;
        return 1.0;
    }

    private static function getHasilScore(string $subCode, $opdId, $fiscalYear): float
    {
        $assessment = SpipAssessment::where('opd_id', $opdId)
            ->where('fiscal_year', $fiscalYear)
            ->whereHas('indicator.subElement', function ($q) use ($subCode) {
                $q->where('code', $subCode);
            })
            ->first();

        if (!$assessment) {
            return 3.0; // Default average score if not filled
        }

        $grade = $assessment->grade_final_inspektorat 
            ?? $assessment->grade_bappeda_verified 
            ?? $assessment->grade_self_opd;

        return self::gradeToScore($grade);
    }

    private static function averageOfCodes(array $scores, array $codes): float
    {
        $sum = 0.0;
        $count = 0;
        foreach ($codes as $code) {
            if (isset($scores[$code])) {
                $sum += $scores[$code];
                $count++;
            }
        }
        return $count > 0 ? $sum / $count : 0.0;
    }
}
