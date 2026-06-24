# Comprehensive Product Requirement Document (PRD)
## Project Name: E-SPIP Terintegrasi (Centralized Internal Control & Maturity Assessment System)

---

## 1. Document Control
* **Version:** 1.0.0
* **Date:** June 24, 2026
* **Target Tech Stack:** Laravel 11+, PostgreSQL / Supabase, Tailwind CSS or Bootstrap 5, Alpine.js / Livewire
* **Author/Product Owner:** Satria Destrian Mahcmuddin

---

## 2. Executive Summary & Core Objective
The **E-SPIP Terintegrasi** application digitizes, centralizes, and automates the local government working papers (*Kertas Kerja Penilaian Mandiri SPIP Pemda*) based on the file `KK PM SPIP Pemda _koreksi inspektorat _1606 (1).xlsx`. 

The system transitions traditional disconnected spreadsheets into a single relational database management platform. It enforces accountability by implementing a strict **3-Tier Linear Workflow** across three government bodies:
1.  **OPD (Self-Assessment Pelaksana):** Enters performance indicators and fills out baseline assessment rubrics.
2.  **Bappeda (Planning Verification):** Validates alignment against macro development goals (*RPJMD/RKPD*) and produces automated regional compilations.
3.  **Inspektorat (Quality Assurance / Auditor):** Verifies evidence attachments, applies corrective scores, and finalizes the final scores for **SPIP**, **MRI** (Management Risk Index), and **IEPK** (Anti-Corruption Index).

---

## 3. User Roles & Role-Based Access Control (RBAC)

The system enforces strict permission scoping to protect data integrity at each workflow phase:

| Role | Access Permissions | Responsibilities |
| :--- | :--- | :--- |
| **Super Admin / Secretariat** | Global CRUD Access | System setup, locking/unlocking fiscal years, managing master parameters (`REF`), and resetting account credentials. |
| **User OPD (Operator)** | Scope: Own Department | Inputting specific departmental planning data, completing checklists, uploading URLs to evidence repositories, and submitting assessments. |
| **Bappeda (Verifikator)** | Scope: Cross-OPD View | Accessing verification grids, reviewing structural alignment, leaving correction notes, and generating aggregated dashboards. |
| **Inspektorat (Auditor/QA)**| Scope: Ultimate Authority | Reviewing submitted evidence folders, inputting final quality assurance corrective scores, overriding draf evaluations, and locking periods. |

---

## 4. System Workflow & Data Pipeline State Machine

Data moves through a strict status pipeline for each active fiscal period to prevent uncoordinated updates:

1.  **`OPD_DRAFT`**: The initial state where departmental operators input their targets, self-assess scores, and update cloud links.
2.  **`BAPPEDA_PROCESS`**: Once submitted by the OPD, editing is locked for that department. Bappeda evaluates organizational cascade alignments.
3.  **`INSPEKTORAT_QA`**: After verification, Bappeda triggers a batch export to the QA ledger. Inspektorat gains editing access for final corrections.
4.  **`FINAL_LOCKED`**: Inspektorat signs off and locks the record. The system runs mathematical formulas to display live dashboard metrics.

---

## 5. Module & Functional Specifications

### 5.1 Master Data & Performance Tree Module
*   **OPD Registry:** Manages the active government department directory (`ref_opd`).
*   **Performance Tree Configuration (`mst_pohon_kinerja`):** Builds a parent-child self-referencing hierarchy structure representing the regional planning layout:
    *   *Level 0:* Local Government Strategic Objectives (*Sasaran Strategis Pemda*)
    *   *Level 1:* Departmental Strategic Objectives (*Sasaran Strategis OPD*)
    *   *Level 2:* Programs (*Sasaran Program*)
    *   *Level 3:* Activities (*Sasaran Kegiatan*)
    *   *Level 4:* Sub-Activities (*Sasaran Sub-Kegiatan*)

### 5.2 Collaborative Appraisal Form Engine (Sheets KKE 1.1 to KK 8)
*   **Dynamic Matrix Grid:** Renders a fast, row-based form replacing sheets `KKE 1.1`, `KKE 1.2`, `KKE 2.1`, `2.2`, `2.3`, `KK3.1 - 3.4`, and `KK 5` to `KK 8`.
*   **Mandatory URL Validation:** Prevents submission if the `evidence_url` field is empty when positive compliance values are claimed.

### 5.3 Tri-Column Score Adjustment Interface
*   The primary view for Bappeda and Inspektorat displaying three side-by-side assessment data columns:
    1.  `Score Self OPD`: Read-only value entered by the operator.
    2.  `Score Verified Bappeda`: Read-only or editable conditional validation by Bappeda.
    3.  `Score Final Inspektorat`: Input field reserved for Auditor overrides.
*   **Live Deviation Counter:** Automatically displays mathematical variance calculations (`Score_Final_Inspektorat` - `Score_Self_Opd`) to instantly expose over-reporting or under-reporting.

### 5.4 Unified Dashboard Roll-up Engine (`KKLEAD_SPIP`)
*   **Automatic Weight Engine:** Applies static structural weights defined in the standard BPKP internal control handbook.
*   **Dynamic KPI Aggregation:** Eliminates manual multi-sheet cross-referencing formulas. Instantly computes real-time values for:
    *   **SPIP Maturity Index**
    *   **Manajemen Risiko Indeks (MRI)**
    *   **Indeks Efektivitas Pencegahan Korupsi (IEPK)**
*   **Data Visualizations:** Outputs dynamic Radar Charts (Spider charts) for the 25 sub-elements, alongside clear target vs achievement performance tables.

---

## 6. Database Schema Architecture (DML/DDL Script)

The optimized PostgreSQL / Supabase physical schema structure to manage this app is detailed below:

```sql
-- 1. Reference: Government Departments
CREATE TABLE ref_opd (
    id SERIAL PRIMARY KEY,
    code_opd VARCHAR(50) UNIQUE NOT NULL,
    name_opd VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Master: Cascading Performance Tree (Self-Referencing Parent ID)
CREATE TABLE mst_pohon_kinerja (
    id SERIAL PRIMARY KEY,
    parent_id INT REFERENCES mst_pohon_kinerja(id) ON DELETE CASCADE,
    fiscal_year INT NOT NULL,
    level_type VARCHAR(50) NOT NULL, -- 'PEMDA', 'OPD', 'PROGRAM', 'KEGIATAN', 'SUB_KEGIATAN'
    opd_id INT REFERENCES ref_opd(id) NULL,
    title_objective TEXT NOT NULL,
    indicator_name TEXT NOT NULL,
    target_value VARCHAR(100) NOT NULL,
    unit_of_measurement VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Transaction: Unified Evaluation Ledger (The Core Form Engine)
CREATE TABLE trx_spip_assessment (
    id SERIAL PRIMARY KEY,
    pohon_kinerja_id INT REFERENCES mst_pohon_kinerja(id) ON DELETE RESTRICT,
    opd_id INT REFERENCES ref_opd(id) ON DELETE RESTRICT,
    fiscal_year INT NOT NULL,
    assessment_type VARCHAR(50) NOT NULL, -- e.g., 'KKE_1.1', 'KKE_1.2', 'KK_3.1', 'KK_5.1'
    
    -- Phase 1: OPD Entry
    score_self_opd NUMERIC(5,2) DEFAULT 0.00,
    notes_opd TEXT NULL,
    evidence_url TEXT NULL,
    opd_submitted_at TIMESTAMP NULL,
    
    -- Phase 2: Bappeda Validation
    score_bappeda_verified NUMERIC(5,2) DEFAULT 0.00,
    notes_bappeda TEXT NULL,
    bappeda_verified_at TIMESTAMP NULL,
    
    -- Phase 3: Inspektorat Quality Assurance Final Score
    score_final_inspektorat NUMERIC(5,2) DEFAULT 0.00,
    notes_inspektorat TEXT NULL,
    inspektorat_audited_at TIMESTAMP NULL,
    
    -- Status Tracker Machine
    status_flow VARCHAR(40) DEFAULT 'OPD_DRAFT', -- 'OPD_DRAFT', 'BAPPEDA_PROCESS', 'INSPEKTORAT_QA', 'FINAL_LOCKED'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Security: Immutable Audit Logs for Score Adjustments
CREATE TABLE audit_score_logs (
    id SERIAL PRIMARY KEY,
    assessment_id INT REFERENCES trx_spip_assessment(id) ON DELETE CASCADE,
    changed_by_user_id INT NOT NULL,
    user_role VARCHAR(50) NOT NULL, -- 'BAPPEDA', 'INSPEKTORAT'
    column_modified VARCHAR(100) NOT NULL, -- 'score_bappeda_verified' or 'score_final_inspektorat'
    old_value NUMERIC(5,2),
    new_value NUMERIC(5,2),
    justification_notes TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create performance indexes for nested recursive tree lookups
CREATE INDEX idx_pohon_kinerja_parent ON mst_pohon_kinerja(parent_id);
CREATE INDEX idx_assessment_flow ON trx_spip_assessment(status_flow, fiscal_year);
```

---

## 7. Implementation & System Optimization Guidelines

*   **Laravel Eloquent Performance Optimization:** When querying the recursive performance tree structures (`mst_pohon_kinerja`), implement eager loading (`with('children')`) or specialized closure table packages to avoid running $N+1$ database queries on complex regional performance trees.
*   **State Locking Checks:** Before performing transaction updates on any assessment row, a global policy or Laravel middleware must check if `status_flow == 'FINAL_LOCKED'`. If true, block all incoming POST/PUT API mutations.
*   **Frontend UI Responsiveness:** Render data tables using optimized sticky header CSS properties to allow smooth vertical scrolling on large evaluation grids, keeping structural titles always visible to verifying officers.
