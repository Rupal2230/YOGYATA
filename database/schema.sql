-- ====================================================================
-- YOGYATA: STUDENT OPPORTUNITY AND BENEFIT NAVIGATOR
-- Canonical MySQL Schema for Schemes, Eligibility & Guidance Workflow
-- ====================================================================

DROP DATABASE IF EXISTS student_opportunity_db;
CREATE DATABASE student_opportunity_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE student_opportunity_db;

-- --------------------------------------------------------------------
-- 1. COLLEGES / INSTITUTIONS
-- --------------------------------------------------------------------
CREATE TABLE colleges (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(80) UNIQUE,
  district VARCHAR(100),
  state VARCHAR(100) DEFAULT 'Maharashtra',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 2. USERS (Roles: student, teacher, counsellor, institution, system_admin)
-- --------------------------------------------------------------------
CREATE TABLE users (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher', 'counsellor', 'institution', 'system_admin') NOT NULL,
  status ENUM('active', 'inactive', 'pending') DEFAULT 'active',
  college_id VARCHAR(64),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL,
  INDEX idx_user_role (role)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 3. STUDENTS & PROFILE ATTRIBUTES FOR STRICT MATCHING
-- --------------------------------------------------------------------
CREATE TABLE students (
  student_id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64) NOT NULL UNIQUE,
  college_id VARCHAR(64),
  full_name VARCHAR(120) NOT NULL,
  date_of_birth DATE,
  gender ENUM('male', 'female', 'other') DEFAULT 'male',
  education_level VARCHAR(60) NOT NULL, -- e.g. 'Class 9', 'Junior College (11th-12th)', 'Undergraduate', 'Postgraduate', 'PhD', 'ITI', 'Medical', 'Engineering', 'Fine Arts', 'Agriculture'
  standard_year VARCHAR(80),
  stream VARCHAR(60), -- 'Science', 'Arts', 'Commerce', 'Engineering', 'Medical', 'Fine Arts', 'Agriculture', 'Veterinary', 'General'
  state VARCHAR(80) DEFAULT 'Maharashtra',
  district VARCHAR(100) DEFAULT 'Pune',
  is_maharashtra_domicile BOOLEAN DEFAULT TRUE,
  category VARCHAR(50) NOT NULL, -- 'OPEN', 'EWS', 'SC', 'ST', 'VJNT', 'OBC', 'SBC', 'Minority', 'SEBC'
  annual_family_income DECIMAL(12,2) NOT NULL, -- Numeric rupees per year
  academic_percentage DECIMAL(5,2) NOT NULL, -- Percentage marks in qualifying examination
  hostel_resident BOOLEAN DEFAULT FALSE, -- Hosteller vs Day Scholar
  marginal_farmer_child BOOLEAN DEFAULT FALSE, -- Parent holds 7/12 Land Extract
  ex_serviceman_ward BOOLEAN DEFAULT FALSE, -- Ward of Armed Forces / Ex-Serviceman
  is_orphan BOOLEAN DEFAULT FALSE, -- Valid Orphan status
  has_disability BOOLEAN DEFAULT FALSE, -- Differently-abled (UDID)
  disability_percentage DECIMAL(5,2) DEFAULT 0.00, -- Benchmark >= 40%
  bocw_worker_child BOOLEAN DEFAULT FALSE, -- Parent registered Construction Laborer (90 days)
  cap_allotment_admitted BOOLEAN DEFAULT TRUE, -- Admitted via Centralized Admission Process
  first_gen_learner BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT TRUE,
  document_availability JSON, -- e.g. {"AADHAAR": true, "DOMICILE_MH": true, "INCOME_CERT": true, ...}
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE SET NULL,
  INDEX idx_strict_match (category, annual_family_income, education_level, academic_percentage)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 4. SCHEMES MASTER TABLE (All 52 General Schemes + 7 Hardware Schemes)
-- --------------------------------------------------------------------
CREATE TABLE schemes (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  scheme_name VARCHAR(255) NOT NULL,
  department VARCHAR(255) NOT NULL,
  level VARCHAR(255) NOT NULL, -- Education level required
  target_audience VARCHAR(255) NOT NULL, -- Target category (OPEN, EWS, SC, ST, VJNT, OBC, SBC, PwD, Minority, etc.)
  income_limit DECIMAL(12,2) DEFAULT NULL, -- NULL means no income ceiling
  income_limit_text VARCHAR(100) DEFAULT 'No Family Income Limit',
  min_academic_percentage DECIMAL(5,2) DEFAULT 0.00, -- Minimum qualifying cut-off percentage
  benefit_details TEXT NOT NULL,
  deadline DATE NOT NULL,
  required_documents JSON NOT NULL, -- Array of document IDs: ["AADHAAR", "DOMICILE_MH", "INCOME_CERT", ...]
  portal_url VARCHAR(500) NOT NULL,
  online_sop TEXT NOT NULL,
  offline_sop TEXT NOT NULL,
  hardware_delivered TEXT DEFAULT NULL, -- Null for financial schemes; specified for hardware schemes (e.g. '4G/5G Tablet + Daily SIM Internet Data')
  requires_hostel BOOLEAN DEFAULT FALSE,
  requires_marginal_farmer BOOLEAN DEFAULT FALSE,
  requires_cap_allotment BOOLEAN DEFAULT FALSE,
  requires_disability BOOLEAN DEFAULT FALSE,
  gender_restriction ENUM('all', 'female', 'male') DEFAULT 'all',
  stream_restriction VARCHAR(100) DEFAULT 'all', -- 'Science', 'Engineering', 'Medical', 'Arts', 'Commerce', etc.
  scheme_category ENUM('general', 'hardware_device', 'merit_scholarship', 'hostel_stipend', 'overseas', 'special_concession') DEFAULT 'general',
  status ENUM('active', 'expired', 'draft') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_scheme_cat (target_audience, status),
  INDEX idx_scheme_deadline (deadline)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 5. STUDENT GUIDANCE REQUESTS & TEACHER WORKFLOW
-- --------------------------------------------------------------------
CREATE TABLE guidance_requests (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  scheme_id VARCHAR(64) NOT NULL,
  request_type ENUM('scheme_application', 'document_verification', 'eligibility_query', 'counseling') DEFAULT 'scheme_application',
  request_message TEXT NOT NULL,
  attached_documents JSON DEFAULT NULL, -- JSON list of student-provided document certificates / readiness
  status ENUM('pending', 'approved', 'rejected', 'document_reupload_requested') DEFAULT 'pending',
  strict_compliance_check BOOLEAN DEFAULT FALSE, -- Calculated boolean if student satisfies all qualification parameters
  compliance_details JSON DEFAULT NULL, -- Detailed verification breakdown per rule
  teacher_notes TEXT DEFAULT NULL,
  reviewed_by VARCHAR(64) DEFAULT NULL, -- Teacher user ID
  reviewed_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_request_status (status),
  INDEX idx_request_scheme (scheme_id)
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 6. STUDENT SCHEME TRACKING & SAVED OPPORTUNITIES
-- --------------------------------------------------------------------
CREATE TABLE student_scheme_tracking (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  scheme_id VARCHAR(64) NOT NULL,
  status ENUM('not_started', 'preparing', 'submitted_online', 'offline_verified', 'benefit_disbursed') DEFAULT 'not_started',
  ready_documents JSON DEFAULT NULL,
  last_updated DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE(student_id, scheme_id),
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- --------------------------------------------------------------------
-- 7. AUDIT LOGS FOR TEACHER & ADMIN ACTIONS
-- --------------------------------------------------------------------
CREATE TABLE audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(64) NULL,
  action VARCHAR(120) NOT NULL,
  entity_type VARCHAR(80),
  entity_id VARCHAR(64),
  details JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;
