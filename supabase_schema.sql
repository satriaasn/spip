-- 1. REFERENCE TABLE: OPD Directory
CREATE TABLE IF NOT EXISTS public.ref_opd (
    id SERIAL PRIMARY KEY,
    code_opd VARCHAR(50) UNIQUE NOT NULL,
    name_opd VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.ref_opd ENABLE ROW LEVEL SECURITY;

-- Select policy: Anyone logged in can read OPDs
CREATE POLICY "Allow read for authenticated users" 
    ON public.ref_opd FOR SELECT 
    USING (auth.role() = 'authenticated');

-- 2. USER PROFILES: Extends Supabase auth.users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    opd_id INT REFERENCES public.ref_opd(id) ON DELETE SET NULL,
    role VARCHAR(50) DEFAULT 'OPD' NOT NULL, -- 'ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT', 'OPD'
    full_name VARCHAR(255),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Allow read for self" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Allow read all profiles for coordinators" 
    ON public.profiles FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('ADMIN', 'BAPPEDA', 'BPKAD', 'INSPEKTORAT')
        )
    );

CREATE POLICY "Allow update for self" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, opd_id)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    COALESCE(new.raw_user_meta_data->>'role', 'OPD'),
    (new.raw_user_meta_data->>'opd_id')::integer
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. MASTER DATA: Cascading Pohon Kinerja (Hierarchical Tree)
CREATE TABLE IF NOT EXISTS public.mst_pohon_kinerja (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES public.mst_pohon_kinerja(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    level_type VARCHAR(50) NOT NULL, -- 'PEMDA', 'OPD', 'PROGRAM', 'KEGIATAN', 'SUB_KEGIATAN'
    opd_id INT REFERENCES public.ref_opd(id) NULL,
    title_objective TEXT NOT NULL,
    indicator_name TEXT NOT NULL,
    target_value VARCHAR(100) NOT NULL,
    unit_of_measurement VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.mst_pohon_kinerja ENABLE ROW LEVEL SECURITY;

-- Pohon Kinerja Policies
CREATE POLICY "Allow read all for authenticated users" 
    ON public.mst_pohon_kinerja FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write for Bappeda or Admin on PEMDA level" 
    ON public.mst_pohon_kinerja FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND (profiles.role = 'BAPPEDA' OR profiles.role = 'ADMIN')
        )
    );

CREATE POLICY "Allow write for OPD on own OPD level" 
    ON public.mst_pohon_kinerja FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.opd_id = mst_pohon_kinerja.opd_id
        )
    );

-- 4. TRANSACTIONS: KKE Quality Assessments
CREATE TABLE IF NOT EXISTS public.trx_kke_assessment (
    id SERIAL PRIMARY KEY,
    pohon_kinerja_id INT REFERENCES public.mst_pohon_kinerja(id) ON DELETE CASCADE,
    opd_id INT REFERENCES public.ref_opd(id) ON DELETE RESTRICT,
    fiscal_year INT NOT NULL,
    assessment_type VARCHAR(50) NOT NULL, -- 'KKE_1.1', 'KKE_1.2', 'KKE_2.1', 'KKE_2.2', 'KKE_2.3'
    assessment_data JSONB NOT NULL,
    status_flow VARCHAR(40) DEFAULT 'OPD_DRAFT' NOT NULL, -- 'OPD_DRAFT', 'BAPPEDA_VERIFY', 'FINAL_LOCKED'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trx_kke_assessment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read for authenticated" 
    ON public.trx_kke_assessment FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write own OPD KKE" 
    ON public.trx_kke_assessment FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.opd_id = trx_kke_assessment.opd_id
        )
    );

CREATE POLICY "Allow verification for Bappeda and Inspektorat" 
    ON public.trx_kke_assessment FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('BAPPEDA', 'INSPEKTORAT', 'ADMIN')
        )
    );

-- 5. TRANSACTIONS: KK3.x Subelement Assessments (OPD Level)
CREATE TABLE IF NOT EXISTS public.trx_subelement_assessment (
    id SERIAL PRIMARY KEY,
    opd_id INT REFERENCES public.ref_opd(id) ON DELETE RESTRICT,
    fiscal_year INT NOT NULL,
    pillar_type VARCHAR(10) NOT NULL, -- 'T1', 'T2', 'T3', 'T4'
    subelement_code VARCHAR(10) NOT NULL, -- e.g. '1.1', '1.2'
    parameter_no INT NOT NULL,
    opd_uraian TEXT,
    opd_grade CHAR(1), -- 'A', 'B', 'C', 'D', 'E'
    opd_aoi_cluster VARCHAR(255),
    opd_aoi_desc TEXT,
    opd_cause_cluster VARCHAR(255),
    opd_cause_desc TEXT,
    verified_grade CHAR(1),
    verified_by_user_id UUID REFERENCES public.profiles(id),
    verification_notes TEXT,
    status_flow VARCHAR(40) DEFAULT 'OPD_DRAFT' NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trx_subelement_assessment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read all subelements" 
    ON public.trx_subelement_assessment FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write own subelements" 
    ON public.trx_subelement_assessment FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.opd_id = trx_subelement_assessment.opd_id
        )
    );

CREATE POLICY "Allow verified override for coordinators" 
    ON public.trx_subelement_assessment FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('BAPPEDA', 'BPKAD', 'INSPEKTORAT', 'ADMIN')
        )
    );

-- 6. TRANSACTIONS: KK5 to KK8 Performance Outcomes
CREATE TABLE IF NOT EXISTS public.trx_achievement_assessment (
    id SERIAL PRIMARY KEY,
    opd_id INT REFERENCES public.ref_opd(id) NULL, -- NULL for Pemda level
    fiscal_year INT NOT NULL,
    kk_type VARCHAR(10) NOT NULL, -- 'KK5.1A', 'KK5.1B', 'KK5.2', 'KK6', 'KK7', 'KK8'
    data_payload JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.trx_achievement_assessment ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read achievements" 
    ON public.trx_achievement_assessment FOR SELECT 
    USING (auth.role() = 'authenticated');

CREATE POLICY "Allow write for own OPD" 
    ON public.trx_achievement_assessment FOR ALL 
    USING (
        (opd_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.opd_id = trx_achievement_assessment.opd_id
        ))
    );

CREATE POLICY "Allow write for coordinators on Pemda/audit sheets" 
    ON public.trx_achievement_assessment FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role IN ('BAPPEDA', 'BPKAD', 'INSPEKTORAT', 'ADMIN')
        )
    );

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pohon_kinerja_parent ON public.mst_pohon_kinerja(parent_id);
CREATE INDEX IF NOT EXISTS idx_subelement_lookup ON public.trx_subelement_assessment(fiscal_year, pillar_type, subelement_code);
CREATE INDEX IF NOT EXISTS idx_kke_lookup ON public.trx_kke_assessment(fiscal_year, opd_id, assessment_type);

-- 7. SEED DATA: ref_opd
INSERT INTO public.ref_opd (id, code_opd, name_opd) VALUES
(1, 'BAPPEDA', 'Badan Perencanaan Pembangunan Daerah'),
(2, 'DISPUSIP', 'Dinas Perpustakaan dan Kearsipan'),
(3, 'INSPEKTORAT', 'Inspektorat'),
(4, 'BKD', 'Badan Kepegawaian Daerah Provinsi Lampung'),
(5, 'DISPORA', 'Dinas Pemuda dan Olahraga'),
(6, 'BALITBANGDA', 'Badan Penelitian dan Pengembangan Daerah'),
(7, 'DESDM', 'Dinas ESDM'),
(8, 'DISKOMINFOTIK', 'Dinas Komunikasi, Informatika dan Statistik Provinsi Lampung'),
(9, 'DLH', 'Dinas Lingkungan Hidup Provinsi Lampung'),
(10, 'DISHUT', 'Dinas Kehutanan'),
(11, 'DKP', 'Dinas Kelautan dan Perikanan'),
(12, 'DISKOPUMKM', 'Dinas Koperasi, Usaha Kecil dan Menengah'),
(13, 'DISBUN', 'Dinas Perkebunan'),
(14, 'DISNAK', 'Dinas Peternakan dan Kesehatan Hewan'),
(15, 'DISNAKER', 'Dinas Tenaga Kerja'),
(16, 'DISPAREKRAF', 'Dinas Pariwisata dan Ekonomi Kreatif'),
(17, 'SATPOLPP', 'Satuan Polisi Pamong Praja Provinsi Lampung'),
(18, 'DISKES', 'Dinas Kesehatan'),
(19, 'DISDIKBUD', 'Dinas Pendidikan dan Kebudayaan Provinsi Lampung'),
(20, 'DKPTPH', 'Dinas Ketahanan Pangan Tanaman Pangan dan Hortikultura'),
(21, 'RSUDAM', 'RSUD Abdoel Moeloek'),
(22, 'BAPENDA', 'Badan Pendapatan Daerah Provinsi Lampung'),
(23, 'DINSOS', 'Dinas Sosial'),
(24, 'DPMPTSP', 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu'),
(25, 'PMDT', 'Dinas Pemberdayaan Masyarakat, Desa dan Transmigrasi'),
(26, 'BPKAD', 'Badan Pengelolaan Keuangan dan Aset Daerah Provinsi Lampung'),
(27, 'DPSDA', 'Dinas Pengelolaan Sumber Daya Air'),
(28, 'DISHUB', 'Dinas Perhubungan Provinsi Lampung'),
(29, 'DBMBK', 'Dinas Bina Marga Bina Konstruksi Provinsi Lampung'),
(30, 'DPKPCK', 'Dinas Perumahan, Kawasan Permukiman dan Cipta Karya'),
(31, 'DISDUKCAPIL', 'Dinas Kependudukan dan Pencatatan Sipil Provinsi Lampung'),
(32, 'DISPERINDAG', 'Dinas Perindustrian dan Perdagangan Provinsi Lampung'),
(33, 'DPPPA', 'Dinas Pemberdayaan Perempuan dan Perlindungan Anak Provinsi Lampung'),
(34, 'BAKESBANGPOL', 'Badan Kesatuan Bangsa dan Politik'),
(35, 'SETWAN', 'Sekretariat DPRD Provinsi Lampung'),
(36, 'BIRO_ORGANISASI', 'Biro Organisasi'),
(37, 'BPBD', 'Badan Penanggulangan Bencana Daerah'),
(38, 'RSJD', 'Rumah Sakit Jiwa Daerah Provinsi Lampung'),
(39, 'PENGHUBUNG', 'Badan Penghubung')
ON CONFLICT (id) DO UPDATE 
SET code_opd = EXCLUDED.code_opd, name_opd = EXCLUDED.name_opd;
