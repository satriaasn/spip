<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Opd;
use App\Models\SubElement;
use App\Models\Indicator;
use App\Models\IndicatorGrade;
use App\Models\PohonKinerja;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\File;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Load spip_data.json
        $jsonPath = database_path('seeders/spip_data.json');
        if (!File::exists($jsonPath)) {
            $this->command->error("spip_data.json file not found at: {$jsonPath}");
            return;
        }

        $this->command->info("Reading and parsing spip_data.json...");
        $data = json_decode(File::get($jsonPath), true);

        // 2. Seed OPDs
        $this->command->info("Seeding OPDs...");
        $opdMap = []; // code => model
        foreach ($data['opds'] as $opdData) {
            $opd = Opd::create([
                'code_opd' => $opdData['code'],
                'name_opd' => $opdData['name'],
                'alias_opd' => str_replace('DINAS ', '', str_replace('BADAN ', '', $opdData['name'])),
            ]);
            $opdMap[$opdData['code']] = $opd;
        }

        // Seed the PEMDA level OPD
        Opd::create([
            'code_opd' => 'OPD_PEMDA',
            'name_opd' => 'Pemerintah Daerah Provinsi Lampung',
            'alias_opd' => 'PEMDA',
        ]);

        // 3. Seed SPIP sub-elements, indicators, and grades
        $this->command->info("Seeding SPIP sub-elements, indicators, and criteria...");
        foreach ($data['sub_elements'] as $subData) {
            $subElement = SubElement::create([
                'code' => $subData['code'],
                'name' => $subData['name'],
                'type' => $subData['type'],
            ]);

            foreach ($subData['indicators'] as $indData) {
                $indicator = Indicator::create([
                    'sub_element_id' => $subElement->id,
                    'indicator_number' => $indData['number'],
                    'indicator_name' => $indData['name'],
                ]);

                foreach ($indData['grades'] as $gradeData) {
                    IndicatorGrade::create([
                        'indicator_id' => $indicator->id,
                        'grade' => $gradeData['grade'],
                        'criteria' => $gradeData['criteria'],
                        'explanation' => $gradeData['explanation'] ?: null,
                        'testing_method' => $gradeData['testing_method'] ?: null,
                    ]);
                }
            }
        }

        // 3.5 Seed IEPK sub-elements, indicators, and criteria
        $this->command->info("Seeding IEPK sub-elements and criteria...");
        $iepkData = [
            ['code' => 'IEPK_1.1', 'name' => 'Kebijakan Antikorupsi', 'criteria' => 'Kebijakan pencegahan korupsi telah ditetapkan dan dikomunikasikan.'],
            ['code' => 'IEPK_1.2', 'name' => 'Seperangkat Regulasi', 'criteria' => 'Terdapat regulasi pendukung kebijakan pencegahan korupsi.'],
            ['code' => 'IEPK_1.3', 'name' => 'Dukungan Sumber Daya', 'criteria' => 'Tersedianya anggaran dan SDM yang memadai untuk pencegahan korupsi.'],
            ['code' => 'IEPK_1.4', 'name' => 'Power (Kekuasaan / Otoritas)', 'criteria' => 'Unit pencegahan korupsi memiliki kewenangan penuh.'],
            ['code' => 'IEPK_1.5', 'name' => 'Pembelajaran', 'criteria' => 'Telah dilakukan sosialisasi dan pembelajaran antikorupsi secara berkala.'],
            ['code' => 'IEPK_2.1', 'name' => 'Asesmen dan Mitigasi Risiko Korupsi', 'criteria' => 'Telah disusun peta risiko korupsi daerah.'],
            ['code' => 'IEPK_2.2', 'name' => 'Saluran Pelaporan / Whistleblowing System', 'criteria' => 'Terdapat saluran pengaduan masyarakat yang terintegrasi.'],
            ['code' => 'IEPK_2.3', 'name' => 'Kepemimpinan Etis', 'criteria' => 'Pimpinan memberikan keteladanan dalam perilaku antikorupsi.'],
            ['code' => 'IEPK_2.4', 'name' => 'Integritas dan Akuntabilitas', 'criteria' => 'Tingginya komitmen integritas pegawai dalam pelayanan publik.'],
            ['code' => 'IEPK_2.5', 'name' => 'Iklim Etis', 'criteria' => 'Terciptanya budaya kerja yang bersih dan berintegritas.'],
            ['code' => 'IEPK_3.1', 'name' => 'Investigasi dan Penuntutan', 'criteria' => 'Setiap laporan pelanggaran ditindaklanjuti secara profesional.'],
            ['code' => 'IEPK_3.2', 'name' => 'Tindakan Korektif / Sanksi', 'criteria' => 'Pemberian sanksi tegas bagi pelaku pelanggaran korupsi.'],
        ];

        foreach ($iepkData as $iepkSub) {
            $sub = SubElement::create([
                'code' => $iepkSub['code'],
                'name' => $iepkSub['name'],
                'type' => 'IEPK',
            ]);

            $ind = Indicator::create([
                'sub_element_id' => $sub->id,
                'indicator_number' => 1,
                'indicator_name' => "Kematangan penerapan pilar {$iepkSub['name']}",
            ]);

            foreach (['E' => 1, 'D' => 2, 'C' => 3, 'B' => 4, 'A' => 5] as $g => $score) {
                IndicatorGrade::create([
                    'indicator_id' => $ind->id,
                    'grade' => $g,
                    'criteria' => "Kriteria Level {$score} untuk {$iepkSub['name']}: {$iepkSub['criteria']}",
                    'explanation' => "Panduan pengujian tingkat {$score}",
                ]);
            }
        }

        // 4. Seed default Users
        $this->command->info("Seeding system users (Admin, OPD, Bappeda, Inspektorat)...");
        
        // Admin
        User::create([
            'name' => 'Super Admin Secretariat',
            'email' => 'admin@spip.test',
            'password' => Hash::make('password'),
            'role' => 'ADMIN',
            'opd_id' => null,
        ]);

        // OPD Operator (DINAS PERPUSTAKAAN DAN KEARSIPAN - Code OPD_01)
        $firstOpd = Opd::where('code_opd', 'OPD_01')->first();
        User::create([
            'name' => 'Operator Perpustakaan & Kearsipan',
            'email' => 'opd@spip.test',
            'password' => Hash::make('password'),
            'role' => 'OPD',
            'opd_id' => $firstOpd ? $firstOpd->id : null,
        ]);

        // Bappeda Verificator
        $bappedaOpd = Opd::where('name_opd', 'like', '%Perencanaan%')->first();
        User::create([
            'name' => 'Verifikator Bappeda',
            'email' => 'bappeda@spip.test',
            'password' => Hash::make('password'),
            'role' => 'BAPPEDA',
            'opd_id' => $bappedaOpd ? $bappedaOpd->id : null,
        ]);

        // Inspektorat QA Auditor
        $inspektoratOpd = Opd::where('name_opd', 'like', '%Inspektorat%')->first();
        User::create([
            'name' => 'QA Auditor Inspektorat',
            'email' => 'inspektorat@spip.test',
            'password' => Hash::make('password'),
            'role' => 'INSPEKTORAT',
            'opd_id' => $inspektoratOpd ? $inspektoratOpd->id : null,
        ]);

        // 5. Seed sample cascading Performance Tree (Pohon Kinerja)
        $this->command->info("Seeding sample performance tree (Pohon Kinerja)...");
        
        // Level 0: Pemda Goal
        $pemdaGoal = PohonKinerja::create([
            'parent_id' => null,
            'fiscal_year' => 2026,
            'level_type' => 'PEMDA',
            'opd_id' => null,
            'title_objective' => 'Meningkatnya Investasi dan Hilirisasi Komoditas Unggulan',
            'indicator_name' => 'Pertumbuhan Realisasi Investasi Tahunan',
            'target_value' => '8.5',
            'unit_of_measurement' => '%',
        ]);

        // Level 1: OPD Goal (associated with Bappeda)
        $opdGoal = PohonKinerja::create([
            'parent_id' => $pemdaGoal->id,
            'fiscal_year' => 2026,
            'level_type' => 'OPD',
            'opd_id' => $bappedaOpd ? $bappedaOpd->id : null,
            'title_objective' => 'Meningkatnya Kualitas Perencanaan dan Pengukuran Kinerja Pembangunan Daerah',
            'indicator_name' => 'Indeks Kualitas Perencanaan Daerah',
            'target_value' => '90',
            'unit_of_measurement' => 'Poin',
        ]);

        // Level 2: Program
        $programGoal = PohonKinerja::create([
            'parent_id' => $opdGoal->id,
            'fiscal_year' => 2026,
            'level_type' => 'PROGRAM',
            'opd_id' => $bappedaOpd ? $bappedaOpd->id : null,
            'title_objective' => 'Program Perencanaan, Pengendalian dan Evaluasi Pembangunan Daerah',
            'indicator_name' => 'Persentase dokumen perencanaan yang diselesaikan tepat waktu',
            'target_value' => '100',
            'unit_of_measurement' => '%',
        ]);

        // Level 3: Kegiatan
        $kegiatanGoal = PohonKinerja::create([
            'parent_id' => $programGoal->id,
            'fiscal_year' => 2026,
            'level_type' => 'KEGIATAN',
            'opd_id' => $bappedaOpd ? $bappedaOpd->id : null,
            'title_objective' => 'Analisis dan Pengkajian Makro Pembangunan Daerah',
            'indicator_name' => 'Jumlah kajian ekonomi makro yang diterbitkan',
            'target_value' => '4',
            'unit_of_measurement' => 'Dokumen',
        ]);

        // Level 4: Sub-Kegiatan
        PohonKinerja::create([
            'parent_id' => $kegiatanGoal->id,
            'fiscal_year' => 2026,
            'level_type' => 'SUB_KEGIATAN',
            'opd_id' => $bappedaOpd ? $bappedaOpd->id : null,
            'title_objective' => 'Penyusunan Rencana Kerja Pemerintah Daerah (RKPD)',
            'indicator_name' => 'Ketepatan waktu penetapan dokumen RKPD',
            'target_value' => 'Bulan Juni',
            'unit_of_measurement' => 'Waktu',
        ]);

        $this->command->info("All seeding completed successfully!");
    }
}
