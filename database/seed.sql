-- ====================================================================
-- YOGYATA: DATABASE SEED FILE
-- Populates all 52 General Schemes + 7 Hardware Schemes from Master Directories
-- Plus Colleges, Users, Students, and Sample Teacher Guidance Requests
-- ====================================================================

USE student_opportunity_db;

-- --------------------------------------------------------------------
-- 1. INSTITUTIONS / COLLEGES
-- --------------------------------------------------------------------
INSERT INTO colleges (id, name, code, district, state) VALUES
('college-coep', 'COEP Technological University, Pune', 'AISHE-U-0312', 'Pune', 'Maharashtra'),
('college-vjti', 'Veermata Jijabai Technological Institute (VJTI), Mumbai', 'AISHE-C-33821', 'Mumbai', 'Maharashtra'),
('college-fergusson', 'Fergusson College (Autonomous), Pune', 'AISHE-C-41480', 'Pune', 'Maharashtra')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- --------------------------------------------------------------------
-- 2. USERS (Teacher & Students)
-- Passwords hash for 'demo123'
-- --------------------------------------------------------------------
INSERT INTO users (id, name, email, password_hash, role, status, college_id) VALUES
('user-teacher-1', 'Prof. Arvind Deshmukh', 'arvind.deshmukh@college.edu.in', '$2b$10$EpRnTzVlqHNP0.f0xU7q7.1OeVz8xH3wW4Oqv7d3nO8k6jG2uP9S6', 'teacher', 'active', 'college-coep'),
('user-student-1', 'Sneha Ramchandra Patil', 'sneha.patil@student.edu.in', '$2b$10$EpRnTzVlqHNP0.f0xU7q7.1OeVz8xH3wW4Oqv7d3nO8k6jG2uP9S6', 'student', 'active', 'college-coep'),
('user-student-2', 'Rahul Suresh Jadhav', 'rahul.jadhav@student.edu.in', '$2b$10$EpRnTzVlqHNP0.f0xU7q7.1OeVz8xH3wW4Oqv7d3nO8k6jG2uP9S6', 'student', 'active', 'college-coep'),
('user-student-3', 'Pooja Sanjay Shinde', 'pooja.shinde@student.edu.in', '$2b$10$EpRnTzVlqHNP0.f0xU7q7.1OeVz8xH3wW4Oqv7d3nO8k6jG2uP9S6', 'student', 'active', 'college-coep'),
('user-student-4', 'Aditya Vinayak Wankhede', 'aditya.wankhede@student.edu.in', '$2b$10$EpRnTzVlqHNP0.f0xU7q7.1OeVz8xH3wW4Oqv7d3nO8k6jG2uP9S6', 'student', 'active', 'college-coep'),
('user-admin-1', 'Dr. Meenakshi Joshi (Registrar)', 'admin@yogyata.ac.in', '$2b$10$EpRnTzVlqHNP0.f0xU7q7.1OeVz8xH3wW4Oqv7d3nO8k6jG2uP9S6', 'system_admin', 'active', 'college-coep')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- --------------------------------------------------------------------
-- 3. STUDENTS PROFILE RECORDS
-- --------------------------------------------------------------------
INSERT INTO students (
  student_id, user_id, college_id, full_name, date_of_birth, gender,
  education_level, standard_year, stream, state, district,
  is_maharashtra_domicile, category, annual_family_income, academic_percentage,
  hostel_resident, marginal_farmer_child, ex_serviceman_ward, is_orphan,
  has_disability, disability_percentage, bocw_worker_child, cap_allotment_admitted,
  profile_completed, document_availability
) VALUES
('student-1', 'user-student-1', 'college-coep', 'Sneha Ramchandra Patil', '2005-04-12', 'female',
 'Undergraduate', 'B.Tech 1st Year', 'Engineering', 'Maharashtra', 'Pune',
 TRUE, 'EWS', 220000.00, 84.50,
 TRUE, TRUE, FALSE, FALSE,
 FALSE, 0.00, FALSE, TRUE,
 TRUE, JSON_OBJECT('AADHAAR', TRUE, 'DOMICILE_MH', TRUE, 'INCOME_CERT', TRUE, 'CAP_ALLOTMENT', TRUE, 'BONAFIDE_CERT', TRUE, 'FEE_RECEIPT', TRUE, '7/12_LAND_EXTRACT', TRUE, 'HOSTEL_RENT_PROOF', TRUE)),

('student-2', 'user-student-2', 'college-coep', 'Rahul Suresh Jadhav', '2004-08-25', 'male',
 'Undergraduate', 'B.Sc 2nd Year', 'Science', 'Maharashtra', 'Kolhapur',
 TRUE, 'OBC', 120000.00, 78.20,
 FALSE, FALSE, FALSE, FALSE,
 FALSE, 0.00, FALSE, TRUE,
 TRUE, JSON_OBJECT('AADHAAR', TRUE, 'DOMICILE_MH', TRUE, 'INCOME_CERT', TRUE, 'CASTE_CERT', TRUE, 'CASTE_VALIDITY', TRUE, 'NCL_CERT', TRUE, '10TH_MARKSHEET', TRUE, '12TH_SCIENCE_MARKSHEET', TRUE, 'COLLEGE_BONAFIDE', TRUE)),

('student-3', 'user-student-3', 'college-coep', 'Pooja Sanjay Shinde', '2006-02-14', 'female',
 'Junior College (11th-12th)', '11th Standard', 'Science', 'Maharashtra', 'Nagpur',
 TRUE, 'SC', 95000.00, 81.00,
 FALSE, FALSE, FALSE, FALSE,
 FALSE, 0.00, FALSE, TRUE,
 TRUE, JSON_OBJECT('AADHAAR', TRUE, 'DOMICILE_MH', TRUE, 'INCOME_CERT', TRUE, 'CASTE_CERT', TRUE, 'CASTE_VALIDITY', TRUE, '10TH_MARKSHEET', TRUE, 'BONAFIDE_CERT', TRUE)),

('student-4', 'user-student-4', 'college-coep', 'Aditya Vinayak Wankhede', '2003-11-09', 'male',
 'Undergraduate', 'B.Tech 2nd Year', 'Engineering', 'Maharashtra', 'Amravati',
 TRUE, 'SC', 750000.00, 68.40,
 TRUE, FALSE, FALSE, FALSE,
 TRUE, 45.00, FALSE, TRUE,
 TRUE, JSON_OBJECT('AADHAAR', TRUE, 'DOMICILE_MH', TRUE, 'INCOME_CERT', TRUE, 'CASTE_CERT', TRUE, 'CASTE_VALIDITY', TRUE, 'DISABILITY_UDID', TRUE, 'CAP_ALLOTMENT', TRUE, 'COLLEGE_BONAFIDE', TRUE))
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- --------------------------------------------------------------------
-- 4. ALL 52 GENERAL SCHEMES (Extracted from YOGYATA 52 Schemes Directory)
-- --------------------------------------------------------------------
INSERT INTO schemes (
  id, title, scheme_name, department, level, target_audience,
  income_limit, income_limit_text, min_academic_percentage, benefit_details,
  deadline, required_documents, portal_url, online_sop, offline_sop,
  hardware_delivered, requires_hostel, requires_marginal_farmer,
  requires_cap_allotment, requires_disability, gender_restriction,
  stream_restriction, scheme_category, status
) VALUES
-- 1. Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)
('sch-01', 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)',
 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna (EBC)',
 'DHE & DTE Maharashtra', 'Diploma, Undergrad, Postgrad', 'OPEN, EWS',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '50% Tuition & Exam Fee Waiver',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CAP_ALLOTMENT', 'BONAFIDE_CERT', 'FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Login on MahaDBT; choose DTE/DHE > RCSM EBC Scheme.\n2. Input CAP allotment number and annual family income certificate details.\n3. Submit application and generate final acknowledgment slip.',
 '1. Submit printed application with attested Domicile, Income, and CAP copies.\n2. College scholarship clerk completes verification in institutional portal.\n3. Joint Director of Technical/Higher Education approves state reimbursement.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'all', 'general', 'active'),

-- 2. Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna (DTE/DHE)
('sch-02', 'Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna (DTE/DHE)',
 'Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna',
 'DTE & DHE Maharashtra', 'Technical Degree / Diploma', 'Children of Registered Marginal Farmers / EWS',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹20,000 to ₹38,000 / Year Cash Hostel Stipend',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'HOSTEL_RENT_PROOF', '7/12_LAND_EXTRACT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Vasatigruh Nirvah Bhatta Yojna under the DTE/DHE tab.\n2. Provide registered hostel/rent agreement and owner contact details.\n3. Upload parent 7/12 land extract to claim the higher marginal farmer allowance.',
 '1. Submit certified rent receipt or college hostel certificate to the welfare section.\n2. College clerk verifies student off-campus residence status.\n3. Stipend is credited in 2 installments directly to the Aadhaar-linked bank account.',
 NULL, TRUE, TRUE, TRUE, FALSE, 'all', 'Engineering', 'hostel_stipend', 'active'),

-- 3. Eklavya Scholarship for Post-Graduate Students (Arts, Science, Commerce, Law)
('sch-03', 'Eklavya Scholarship for Post-Graduate Students (Arts, Science, Commerce, Law)',
 'Eklavya Scholarship for Post-Graduate Students',
 'Directorate of Higher Education', 'Post-Graduate Degree (MA, MSc, MCom, LLM)', 'Meritorious PG Students (All Categories)',
 75000.00, '≤ ₹75,000 / Year', 60.00, '₹5,000 / Year Merit Grant',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'UG_DEGREE_MARKSHEET', 'BONAFIDE_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Log in on MahaDBT; navigate to DHE > Eklavya Scholarship.\n2. Enter graduation aggregate marks and verify Tehsildar income limit.\n3. Submit application and save generated tracking serial.',
 '1. Submit graduation final marksheet and current PG bonafide to college desk.\n2. College forwards approved merit roster to DHE Divisional Joint Director.\n3. Grant is credited directly to the student\'s Aadhaar-linked bank account.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active'),

-- 4. State Government Open Merit Scholarship for Degree College Students
('sch-04', 'State Government Open Merit Scholarship for Degree College Students',
 'State Government Open Merit Scholarship for Degree College Students',
 'Directorate of Higher Education', 'Undergraduate (BA, BSc, BCom)', 'General Meritorious Students (OPEN, ALL)',
 NULL, 'No Income Ceiling (Merit Based)', 75.00, '₹1,000 / Year (₹100/Month × 10)',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', '12TH_HSC_MARKSHEET', 'COLLEGE_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select State Government Open Merit Scholarship on MahaDBT DHE menu.\n2. Enter standard 12th board seat number and verified marksheet score.\n3. Submit form to institute queue for merit list scrutiny.',
 '1. Submit attested 12th marksheet to college scholarship department.\n2. College certifies merit ranking and forwards the batch to DHE Pune.\n3. Annual scholarship is deposited directly into the student\'s bank account.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active'),

-- 5. Scholarship to Meritorious Students in Mathematics and Physics
('sch-05', 'Scholarship to Meritorious Students in Mathematics and Physics',
 'Scholarship to Meritorious Students in Mathematics and Physics',
 'Directorate of Higher Education', 'Undergraduate B.Sc. (Physics/Mathematics)', 'Students Majoring in Maths or Physics',
 NULL, 'No Family Income Limit', 60.00, '₹1,000 / Month (₹10,000 / Year)',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', '12TH_SCIENCE_MARKSHEET', 'COLLEGE_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Scholarship in Mathematics and Physics under DHE on MahaDBT.\n2. Provide Class 12 Science marksheet verifying Mathematics/Physics marks.\n3. Submit form for departmental approval.',
 '1. Submit verified enrollment certificate in B.Sc. Maths/Physics stream.\n2. College Head of Department validates course subject combination.\n3. DHE Pune releases monthly stipend directly via DBT.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'Science', 'merit_scholarship', 'active'),

-- 6. Government Vidyaniketan Scholarship for Meritorious Students
('sch-06', 'Government Vidyaniketan Scholarship for Meritorious Students',
 'Government Vidyaniketan Scholarship for Meritorious Students',
 'Directorate of Higher Education', '11th, 12th & Degree Programs', 'Alumni of State Government Vidyaniketans',
 NULL, 'No Income Ceiling', 60.00, '₹100 / Month (₹1,000 / Year)',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'VIDYANIKETAN_PASSING_CERT', 'BONAFIDE_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Government Vidyaniketan Scholarship on MahaDBT portal.\n2. Link passing registration number from designated State Vidyaniketan school.\n3. Submit online application.',
 '1. Provide school leaving certificate confirming Government Vidyaniketan completion.\n2. Institution forwards verified batch to regional Joint Director.\n3. Disbursement occurs annually to verified bank accounts.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active'),

-- 7. State Government Open Merit Scholarship for Junior College (11th & 12th)
('sch-07', 'State Government Open Merit Scholarship for Junior College (11th & 12th)',
 'State Government Open Merit Scholarship for Junior College',
 'Directorate of Higher Education', 'Junior College (Classes 11 & 12)', 'General Meritorious Students',
 NULL, 'No Family Income Limit', 70.00, '₹50 / Month (₹500 / Year)',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', '10TH_SSC_MARKSHEET', 'JR_COLLEGE_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Open Merit Scholarship for Junior College under DHE.\n2. Enter Class 10 SSC examination roll number and total marks.\n3. Submit application for Junior College Principal scrutiny.',
 '1. Present original Class 10 marksheet to junior college clerk.\n2. Principal approves merit quota allocation on the institutional portal.\n3. Scholarship is disbursed for two consecutive years (Class 11 & 12).',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active'),

-- 8. Education Concession to the Children of Ex-Servicemen & Freedom Fighters
('sch-08', 'Education Concession to the Children of Ex-Servicemen & Freedom Fighters',
 'Education Concession to Children of Ex-Servicemen & Freedom Fighters',
 'Directorate of Higher Education', 'Junior College, Degree, Professional Courses', 'Wards of Ex-Servicemen / Freedom Fighters',
 NULL, 'No Income Ceiling', 0.00, '100% Tuition, Library & Exam Fee Waiver',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'SAINIK_BOARD_CERT', 'DOMICILE_MH', 'COLLEGE_FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Concession to Children of Ex-Servicemen on MahaDBT.\n2. Enter District Sainik Welfare Board registration.\n3. Submit form with admission details.',
 '1. Submit Ex-Servicemen Identity Card / Freedom Fighter Sanad copy.\n2. College fee counter grants direct waiver of mandatory fees.\n3. Institution claims reimbursement through DHE state accounts.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'special_concession', 'active'),

-- 9. Government of India Post-Matric Scholarship for SC Students
('sch-09', 'Government of India Post-Matric Scholarship for SC Students',
 'Government of India Post-Matric Scholarship for SC Students',
 'Social Justice & Special Assistance', 'Class 11 to PhD / Post-Doc', 'SC, Navbuddha',
 250000.00, '≤ ₹2,50,000 / Year', 0.00, '100% Fee Waiver + ₹230–₹1,200/Mo Stipend',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Log in on MahaDBT > Social Justice & Special Assistance tab.\n2. Select Government of India Post-Matric Scholarship.\n3. Validate Caste Scrutiny Committee Certificate number online.',
 '1. Submit printed form with copies of Caste Validity and current fee receipt.\n2. College Principal clears institutional scrutiny on MahaDBT.\n3. District Social Welfare Officer sanctions final DBT fund release.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 10. Post-Matric Tuition Fee and Examination Fee (Freeship) for SC Students
('sch-10', 'Post-Matric Tuition Fee and Examination Fee (Freeship) for SC Students',
 'Post-Matric Freeship for SC Students',
 'Social Justice & Special Assistance', 'Diploma, Degree, PG, Professional', 'SC',
 NULL, 'Above ₹2,50,000 (No Upper Ceiling)', 0.00, '100% Tuition & Exam Fee Waiver',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'CASTE_CERT', 'CASTE_VALIDITY', 'CAP_ALLOTMENT', 'FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Post-Matric Freeship Scheme in the Social Justice department tab.\n2. Declare income above ₹2,50,000 (upload parent Form 16 / ITR).\n3. Input CAP admission confirmation details.',
 '1. Print submitted freeship application and attach Caste Validity certificate.\n2. Submit file to college scholarship clerk for institutional audit.\n3. Fee waiver is credited directly to the institution\'s account.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'all', 'general', 'active'),

-- 11. Dr. Babasaheb Ambedkar Swadhar Yojana (SC Cash Lodging Grant)
('sch-11', 'Dr. Babasaheb Ambedkar Swadhar Yojana (SC Cash Lodging Grant)',
 'Dr. Babasaheb Ambedkar Swadhar Yojana',
 'Social Justice & Special Assistance', '11th, 12th, Diploma, Degree, PG', 'SC',
 250000.00, '≤ ₹2,50,000 / Year', 50.00, '₹43,000 to ₹60,000 / Year Cash Living Support',
 '2026-12-15', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'HOSTEL_NON_ADMISSION_CERT'),
 'https://sjsa.maharashtra.gov.in',
 '1. Select Swadhar Yojna in the Social Justice scheme menu.\n2. Provide admission proof, qualifying percentage, and IFSC bank details.\n3. Confirm non-availability of seat in Government SC Hostels.',
 '1. Obtain Non-Admission Certificate from local Govt SC Hostel.\n2. Execute certified rental agreement with landlord in college city.\n3. Submit application folder to Assistant Commissioner of Social Welfare.',
 NULL, TRUE, FALSE, FALSE, FALSE, 'all', 'all', 'hostel_stipend', 'active'),

-- 12. Maintenance Allowance for SC Students Studying in Professional Courses
('sch-12', 'Maintenance Allowance for SC Students Studying in Professional Courses',
 'Maintenance Allowance for SC Students in Professional Courses',
 'Social Justice & Special Assistance', 'Engineering, Medicine, Vet, Agriculture', 'SC',
 250000.00, '≤ ₹2,50,000 / Year', 0.00, '₹500 to ₹1,000 / Month Allowance',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'CASTE_CERT', 'HOSTEL_PROOF', 'PROFESSIONAL_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Choose Maintenance Allowance for Professional Courses on MahaDBT.\n2. Declare hostel stay status (college hostel or certified rental).\n3. Submit form alongside standard post-matric application.',
 '1. Provide hostel warden certificate or rent agreement to college clerk.\n2. Institution approves living allowance schedule.\n3. Funds are credited directly to the student\'s bank account.',
 NULL, TRUE, FALSE, FALSE, FALSE, 'all', 'Engineering', 'hostel_stipend', 'active'),

-- 13. State Post-Matric Scholarship for Persons with Disability (PwD)
('sch-13', 'State Post-Matric Scholarship for Persons with Disability (PwD)',
 'State Post-Matric Scholarship for Persons with Disability',
 'Social Justice & Special Assistance', '11th, 12th, ITI, Diploma, Degree, PG', 'Differently-Abled (Benchmark ≥ 40%)',
 NULL, 'No Family Income Ceiling', 0.00, '100% Fee Waiver + Reader & Maintenance Allowance',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'DISABILITY_UDID', 'BONAFIDE_CERT', 'FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Access MahaDBT > Social Justice & Special Assistance tab.\n2. Select Post-Matric Scholarship for Persons with Disability.\n3. Input Unique Disability ID (UDID) registration number and category.',
 '1. Submit copy of Unique Disability ID (UDID) issued by Civil Surgeon.\n2. College verifies disability status and submits online approval.\n3. State releases full fee waiver and monthly reader/maintenance allowance.',
 NULL, FALSE, FALSE, FALSE, TRUE, 'all', 'all', 'special_concession', 'active'),

-- 14. Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship for 100 SC Students (Overseas)
('sch-14', 'Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship for 100 SC Students (Overseas)',
 'RCSM Overseas Scholarship for SC Students',
 'Social Justice & Special Assistance', 'Post-Graduation / PhD at QS Top 300 Global Universities', 'SC',
 600000.00, '≤ ₹6,00,000 / Year', 60.00, '100% Foreign Tuition + Living Allowance + Airfare',
 '2026-10-31', JSON_ARRAY('PASSPORT', 'FOREIGN_UNIV_UNCONDITIONAL_OFFER', 'CASTE_CERT', 'CASTE_VALIDITY', 'INCOME_CERT'),
 'https://sjsa.maharashtra.gov.in',
 '1. Register on the SJSA Foreign Scholarship portal during the annual window.\n2. Submit unconditional offer letter from QS Top 300 foreign universities.\n3. Provide GRE/TOEFL/IELTS scorecards and academic transcripts.',
 '1. Appear for document scrutiny at the Social Welfare Commissionerate, Pune.\n2. Execute surety bond with two government guarantors.\n3. State treasury transfers full tuition fees directly to the foreign university.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'overseas', 'active'),

-- 15. Savitribai Phule Scholarship for SC Girls (School Education 5th to 10th)
('sch-15', 'Savitribai Phule Scholarship for SC Girls (School Education 5th to 10th)',
 'Savitribai Phule Scholarship for SC Girls',
 'Social Justice & Special Assistance', 'Secondary School (Classes 5 to 10)', 'SC Girls',
 NULL, 'No Family Income Ceiling', 0.00, '₹600 to ₹1,000 / Year Direct Grant',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'CASTE_CERT', 'SCHOOL_BONAFIDE', 'STUDENT_BANK_PASSBOOK'),
 'https://sjsa.maharashtra.gov.in',
 '1. Headmaster surveys enrolled SC girl students in Classes 5–10.\n2. Clerk inputs student Aadhaar and bank details into Pre-Matric portal.\n3. Headmaster signs consolidated batch proposal for the school.',
 '1. Parents provide student\'s bank passbook copy and caste proof to school.\n2. Social Welfare Department sanctions the annual allowance.\n3. Allowance is deposited directly into the student\'s savings account.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'female', 'all', 'general', 'active'),

-- 16. Maintenance Allowance for SC Students Studying in Military & Sainik Schools
('sch-16', 'Maintenance Allowance for SC Students Studying in Military & Sainik Schools',
 'Maintenance Allowance for SC in Sainik Schools',
 'Social Justice & Special Assistance', 'Classes 6 to 12 in Recognized Sainik/Military Schools', 'SC',
 250000.00, '≤ ₹2,50,000 / Year', 0.00, 'Full Lodging, Boarding & Uniform Fee Reimbursement',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'CASTE_CERT', 'SAINIK_SCHOOL_ADMISSION_CERT', 'INCOME_CERT'),
 'https://sjsa.maharashtra.gov.in',
 '1. Select Sainik School Maintenance Scheme under Social Justice.\n2. Provide Sainik School admission verification roll number and fee demand.\n3. Submit application.',
 '1. Sainik School Principal endorses composite mess, uniform, and tuition dues.\n2. District Social Welfare Officer releases payment directly to the Sainik School.',
 NULL, TRUE, FALSE, FALSE, FALSE, 'all', 'all', 'special_concession', 'active'),

-- 17. Government of India Post-Matric Scholarship for ST Students
('sch-17', 'Government of India Post-Matric Scholarship for ST Students',
 'Government of India Post-Matric Scholarship for ST Students',
 'Tribal Development Department', 'Class 11 to PhD / Professional Courses', 'ST',
 250000.00, '≤ ₹2,50,000 / Year', 0.00, '100% Fee Waiver + ₹380–₹1,200/Mo Stipend',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'ST_CASTE_CERT', 'TRIBE_VALIDITY', 'FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Access MahaDBT > Tribal Development Department.\n2. Select Post Matric Scholarship Scheme (Government Of India).\n3. Input Tribe Validity Certificate number and issue date.',
 '1. Submit printed form with copies of Tribe Validity and admission receipt.\n2. College validates credentials and forwards to the Project Officer (ITDP).\n3. Tuition fee and monthly maintenance are disbursed directly.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 18. Tuition Fee and Examination Fee for Tribal Students (ST Freeship)
('sch-18', 'Tuition Fee and Examination Fee for Tribal Students (ST Freeship)',
 'ST Freeship Scheme',
 'Tribal Development Department', 'Diploma, Undergrad, Postgrad, Professional', 'ST',
 NULL, 'Above ₹2,50,000 (No Upper Ceiling)', 0.00, '100% Tuition & Exam Fee Waiver',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'ST_CASTE_CERT', 'TRIBE_VALIDITY', 'CAP_ALLOTMENT', 'FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Tuition Fee & Exam Fee for Tribal Students (Freeship) on MahaDBT.\n2. Declare income above ₹2,50,000; verify CAP allotment order.\n3. Submit application.',
 '1. Submit hard copy application to college scholarship section.\n2. College verifies institutional fee structure approved by FRA.\n3. State government credits approved fees directly to the college account.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'all', 'general', 'active'),

-- 19. Pandit Deendayal Upadhyay Swayam Yojana (ST Cash Lodging Grant)
('sch-19', 'Pandit Deendayal Upadhyay Swayam Yojana (ST Cash Lodging Grant)',
 'Pandit Deendayal Upadhyay Swayam Yojana',
 'Tribal Development Department', 'Post-Matric Professional / Non-Prof', 'ST',
 250000.00, '≤ ₹2,50,000 / Year', 0.00, '₹43,000 to ₹60,000 / Year Cash Hostel Stipend',
 '2026-12-15', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'ST_CASTE_CERT', 'TRIBE_VALIDITY', 'HOSTEL_RENT_PROOF'),
 'https://tribal.maharashtra.gov.in',
 '1. Access Tribal Portal / Swayam Application Module.\n2. Validate Tribe Certificate and Tribe Validity details online.\n3. Select city tier (Mumbai/Pune ₹60k, Divisional ₹51k, District ₹43k).',
 '1. Obtain Government Tribal Hostel non-admission confirmation certificate.\n2. Assemble original rent receipts, college bonafide, and fee receipt.\n3. Submit dossier to Project Officer, Integrated Tribal Development Project (ITDP).',
 NULL, TRUE, FALSE, FALSE, FALSE, 'all', 'all', 'hostel_stipend', 'active'),

-- 20. Vocational Education Fee Reimbursement for ST Students
('sch-20', 'Vocational Education Fee Reimbursement for ST Students',
 'Vocational Education Fee Reimbursement for ST Students',
 'Tribal Development Department', 'Engineering, MBA, Pharmacy, Architecture', 'ST',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '100% Course Fee Reimbursement in Private Unaided Colleges',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'TRIBE_VALIDITY', 'CAP_ALLOTMENT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Vocational Education Fee Reimbursement under Tribal Department.\n2. Enter CAP seat allotment and fee regulating authority (FRA) details.\n3. Submit electronic form.',
 '1. College accounts section scrutinizes CAP allotment and fee breakups.\n2. ITDP Project Officer conducts audit and sanctions payment to institution.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'Engineering', 'general', 'active'),

-- 21. Vocational Education Maintenance Allowance for ST Students
('sch-21', 'Vocational Education Maintenance Allowance for ST Students',
 'Vocational Education Maintenance Allowance for ST',
 'Tribal Development Department', 'Professional Courses (Engg, MBBS, Agriculture)', 'ST',
 250000.00, '≤ ₹2,50,000 / Year', 0.00, '₹7,000 to ₹10,000 / Year Cash Living Allowance',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'TRIBE_VALIDITY', 'HOSTEL_CERT', 'COLLEGE_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Vocational Education Maintenance Allowance on MahaDBT.\n2. Declare professional course duration and local accommodation particulars.\n3. Submit application.',
 '1. Submit bonafide and hostel certificate to institutional scholarship cell.\n2. Principal forwards proposal to the regional ITDP Project Officer.\n3. Allowance is disbursed directly to student\'s bank account.',
 NULL, TRUE, FALSE, FALSE, FALSE, 'all', 'Engineering', 'hostel_stipend', 'active'),

-- 22. Foreign Education Scholarship for Scheduled Tribe Students
('sch-22', 'Foreign Education Scholarship for Scheduled Tribe Students',
 'Foreign Education Scholarship for Scheduled Tribe Students',
 'Tribal Development Department', 'Master\'s / PhD in World Top 100 Universities', 'ST',
 600000.00, '≤ ₹6,00,000 / Year', 60.00, 'Full Tuition Fees + Living Stipend + Economy Airfare',
 '2026-10-31', JSON_ARRAY('PASSPORT', 'FOREIGN_UNIV_OFFER', 'ST_CASTE_CERT', 'TRIBE_VALIDITY', 'INCOME_CERT'),
 'https://tribal.maharashtra.gov.in',
 '1. Register on Tribal Research & Training Institute (TRTI) / TDD Portal.\n2. Submit unconditional offer from recognized global university.\n3. Provide GRE/IELTS/TOEFL language proficiency records.',
 '1. Attend physical verification at Tribal Commissionerate, Nashik.\n2. Execute legal agreement and furnish bond sureties.\n3. Government releases international tuition fees directly to the foreign university.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'overseas', 'active'),

-- 23. Post-Matric Scholarship to VJNT Students
('sch-23', 'Post-Matric Scholarship to VJNT Students',
 'Post-Matric Scholarship to VJNT Students',
 'VJNT, OBC & SBC Welfare', 'Class 11, Diploma, ITI, Degree, PG', 'VJNT (DT-A, NT-B, NT-C, NT-D)',
 150000.00, '≤ ₹1,50,000 / Year', 0.00, '100% Fee Waiver + Maintenance Stipend',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Access MahaDBT > VJNT, OBC and SBC Welfare Department.\n2. Select Post Matric Scholarship to VJNT Students.\n3. Enter Non-Creamy Layer Certificate issuance number and validity dates.',
 '1. Assemble printout with attested photocopies of Caste, Validity, and NCL.\n2. Submit file to the College Scholarship Counter for scrutiny.\n3. District Welfare Officer sanctions and disburses maintenance allowance.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 24. Tuition Fees and Examination Fees to VJNT Students (Freeship)
('sch-24', 'Tuition Fees and Examination Fees to VJNT Students (Freeship)',
 'VJNT Freeship Scheme',
 'VJNT, OBC & SBC Welfare', 'Higher Secondary, Diploma, Degree, PG', 'VJNT (DT-A, NT-B, NT-C, NT-D)',
 800000.00, '₹1,50,001 to ₹8,00,000 / Year', 0.00, '100% Tuition & Exam Fee Concession',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Payment of Tuition Fees & Exam Fees to VJNT Students.\n2. Declare income between ₹1.5L and ₹8.0L; provide valid NCL.\n3. Submit application.',
 '1. Submit documents to college clerk; fees are adjusted on the institutional fee portal.\n2. State government reimburses verified tuition dues directly to the college.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 25. Post-Matric Scholarship to OBC Students
('sch-25', 'Post-Matric Scholarship to OBC Students',
 'Post-Matric Scholarship to OBC Students',
 'VJNT, OBC & SBC Welfare', 'Higher Secondary, Diploma, Undergrad, PG', 'OBC',
 150000.00, '≤ ₹1,50,000 / Year', 0.00, '50% to 100% Fee Waiver + Maintenance Stipend',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Post Matric Scholarship to OBC Students on MahaDBT.\n2. Provide valid NCL certificate details; verify Aadhaar-seeded bank status.\n3. Submit form to route application to the college scholarship desk.',
 '1. Submit physical copies of valid NCL certificate and Caste Validity.\n2. College nodal officer verifies academic enrollment and fee records.\n3. Principal approves application on the institutional MahaDBT portal.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 26. Tuition Fees and Examination Fees to OBC Students (Freeship)
('sch-26', 'Tuition Fees and Examination Fees to OBC Students (Freeship)',
 'OBC Freeship Scheme',
 'VJNT, OBC & SBC Welfare', 'Higher Secondary, Diploma, Degree, PG', 'OBC',
 800000.00, '₹1,50,001 to ₹8,00,000 / Year', 0.00, '50% to 100% Tuition Fee Concession',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Choose Payment of Tuition Fees & Exam Fees to OBC Students on MahaDBT.\n2. Verify income is under ₹8,00,000 and upload active NCL certificate.\n3. Submit form.',
 '1. Submit dossier to college scholarship desk for fee concession mapping.\n2. College accounts confirms approved fee structure against FRA guidelines.\n3. State transfers tuition waiver portion to the institution.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 27. Post-Matric Scholarship to SBC Students
('sch-27', 'Post-Matric Scholarship to SBC Students',
 'Post-Matric Scholarship to SBC Students',
 'VJNT, OBC & SBC Welfare', 'Post-Matric (11th to Postgrad)', 'SBC',
 150000.00, '≤ ₹1,50,000 / Year', 0.00, '100% Fee Waiver + Maintenance Stipend',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Post Matric Scholarship to SBC Students on MahaDBT.\n2. Enter Caste Certificate and valid Non-Creamy Layer details.\n3. Submit electronic application and download computer-generated receipt.',
 '1. Attach verified SBC Caste Certificate and current-year NCL certificate.\n2. Hand in physical paperwork at the College Scholarship Section.\n3. College forwards approved record to District Social Welfare Officer.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 28. Tuition Fees and Examination Fees to SBC Students (Freeship)
('sch-28', 'Tuition Fees and Examination Fees to SBC Students (Freeship)',
 'SBC Freeship Scheme',
 'VJNT, OBC & SBC Welfare', 'Higher Secondary, Diploma, Degree, PG', 'SBC',
 800000.00, '₹1,50,001 to ₹8,00,000 / Year', 0.00, '100% Tuition & Exam Fee Concession',
 '2027-01-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Payment of Tuition Fees & Exam Fees to SBC Students.\n2. Upload NCL certificate and income proof; submit application.',
 '1. College clerk reviews documents; fee concession is applied on the student ledger.\n2. Government reimburses approved fee amount to the college.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 29. Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship for VJNT & SBC (11th & 12th)
('sch-29', 'Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship for VJNT & SBC (11th & 12th)',
 'RCSM Merit Scholarship for VJNT & SBC',
 'VJNT, OBC & SBC Welfare', 'Junior College (Classes 11 & 12)', 'VJNT, SBC',
 NULL, 'No Income Ceiling', 75.00, '₹3,000 / Year (₹300/Month × 10)',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'CASTE_CERT', 'SSC_MARKSHEET', 'JUNIOR_COLLEGE_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Rajarshi Chhatrapati Shahu Maharaj Merit Scholarship on MahaDBT.\n2. Upload Class 10 (SSC) marksheet showing ≥ 75% aggregate marks.\n3. Submit application for Junior College Principal scrutiny.',
 '1. Submit attested copy of Class 10 Board Marksheet and Caste Certificate.\n2. Principal digitally validates the merit list on MahaDBT.\n3. Grant of ₹3,000/year is disbursed for both Class 11 and Class 12.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active'),

-- 30. Mahatma Jyotiba Phule Overseas Scholarship for OBC, VJNT & SBC Scholars
('sch-30', 'Mahatma Jyotiba Phule Overseas Scholarship for OBC, VJNT & SBC Scholars',
 'Mahatma Jyotiba Phule Overseas Scholarship',
 'VJNT, OBC & SBC Welfare', 'Post-Graduate Degree / PhD at QS Top 200 Global Universities', 'OBC, VJNT, SBC',
 800000.00, '≤ ₹8,00,000 / Year', 60.00, 'Full Tuition Fees + Annual Subsistence Allowance + Airfare',
 '2026-10-31', JSON_ARRAY('PASSPORT', 'FOREIGN_OFFER_LETTER', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'https://bahujankalyan.maharashtra.gov.in',
 '1. Submit online dossier on Bahujan Kalyan overseas scholarship portal.\n2. Attach confirmed admission letter from QS Top 200 foreign university.\n3. Upload degree marksheets, statement of purpose, and reference letters.',
 '1. Appear for interview and document audit before the State Selection Committee.\n2. Execute surety bond with two state government employee guarantors.\n3. Tuition fees are remitted directly to the foreign university treasury.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'overseas', 'active'),

-- 31. Rajarshi Chhatrapati Shahu Maharaj Fee Reimbursement for Medical Students (DMER)
('sch-31', 'Rajarshi Chhatrapati Shahu Maharaj Fee Reimbursement for Medical Students (DMER)',
 'RCSM Fee Reimbursement for Medical Students',
 'Directorate of Medical Education & Research', 'MBBS, BDS, BAMS, BHMS, BPTH, BSc Nursing', 'EWS, OPEN',
 800000.00, '≤ ₹8,00,000 / Year', 50.00, '50% Tuition Fee Reimbursement',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'NEET_SCORECARD', 'CAP_ALLOTMENT', 'INCOME_CERT', 'COLLEGE_FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Log in on MahaDBT; select Directorate of Medical Education and Research.\n2. Choose RCSM Medical Fee Reimbursement Scheme.\n3. Link NEET CAP Allotment letter and approved college fee receipt.',
 '1. Submit hard copy application dossier to the Medical College Student Section.\n2. Dean / Principal verifies NEET rank and fee payment records.\n3. DMER Mumbai approves and disburses the 50% tuition fee reimbursement.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'Medical', 'general', 'active'),

-- 32. Dr. Panjabrao Deshmukh Hostel Maintenance Allowance for Medical Students (DMER)
('sch-32', 'Dr. Panjabrao Deshmukh Hostel Maintenance Allowance for Medical Students (DMER)',
 'Dr. Panjabrao Deshmukh Hostel Allowance (Medical)',
 'Directorate of Medical Education & Research', 'Health Science Degree Courses (MBBS, BDS, etc.)', 'Children of Small/Marginal Farmers in Medical',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹30,000/Yr (Tier-1) or ₹20,000/Yr (Other)',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'HOSTEL_PROOF', '7/12_LAND_RECORD'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Dr. Panjabrao Deshmukh Hostel Allowance (DMER) on MahaDBT.\n2. Declare hostel stay status and upload rent agreement / hostel certificate.\n3. Submit application.',
 '1. Submit hostel warden certificate and parent land holding record to Dean\'s office.\n2. Medical College clerk clears verification on the DMER administrative portal.\n3. Allowance is deposited directly into the medical student\'s bank account.',
 NULL, TRUE, TRUE, TRUE, FALSE, 'all', 'Medical', 'hostel_stipend', 'active'),

-- 33. State Minority Scholarship for Higher & Professional Courses
('sch-33', 'State Minority Scholarship for Higher & Professional Courses',
 'State Minority Scholarship for Higher & Professional Courses',
 'Minority Development Department', 'Technical & Professional Undergrad / PG', 'Muslim, Buddhist, Christian, Jain, Sikh, Parsi',
 800000.00, '≤ ₹8,00,000 / Year', 50.00, 'Up to ₹50,000 / Year Direct Grant',
 '2026-12-15', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'MINORITY_SELF_DECLARATION', 'BONAFIDE_CERT', 'FEE_RECEIPT'),
 'https://mdd.maharashtra.gov.in',
 '1. Select Minority Development Department on the MahaDBT portal.\n2. Choose Scholarship for Minority Communities (Technical/Prof).\n3. Complete religious minority self-declaration (Muslim, Christian, Buddhist, etc.).',
 '1. Print application form and sign the religious minority self-declaration.\n2. Attach Domicile Certificate, current course Bonafide, and fee receipt.\n3. Submit documentation bundle to the college scholarship desk.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'Engineering', 'general', 'active'),

-- 34. State Minority Scholarship Part II for Non-Professional Courses (DHE)
('sch-34', 'State Minority Scholarship Part II for Non-Professional Courses (DHE)',
 'State Minority Scholarship Part II for Non-Professional Courses',
 'Minority Development Department', 'General Higher Education (BA, B.Com, B.Sc, MA, M.Com, M.Sc)', 'Religious Minority Students',
 800000.00, '≤ ₹8,00,000 / Year', 50.00, '₹5,000 / Year Direct Bank Transfer',
 '2026-12-15', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'MINORITY_DECLARATION', 'PREVIOUS_MARKSHEET'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select State Minority Scholarship Part II (DHE) on MahaDBT.\n2. Submit academic performance record and verify self-declaration.\n3. Confirm application submission.',
 '1. Submit hard copy bundle to college student scholarship clerk.\n2. College validates non-professional degree enrollment.\n3. Grant is credited directly to the student\'s savings bank account.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 35. Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (Directorate of Art)
('sch-35', 'Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti (Directorate of Art)',
 'RCSM Fee Waiver for Fine Arts Students',
 'Directorate of Art, Maharashtra', 'Applied Art, Painting, Sculpture, Commercial Art', 'OPEN, EWS Fine Arts Students',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '50% Tuition & Exam Fee Waiver',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'AAC_CET_ALLOTMENT', 'ART_COLLEGE_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Directorate of Art > RCSM Shikshan Shulkh Yojna on MahaDBT.\n2. Input State Fine Arts CET (MH-AAC-CET) seat allocation particulars.\n3. Submit application for art institute review.',
 '1. Submit certified fee receipt and CET allotment copy to the Art College office.\n2. Principal of Government/Recognized Art College validates portfolio and admission.\n3. Directorate of Art Mumbai releases fee reimbursement subsidy.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'Fine Arts', 'general', 'active'),

-- 36. Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna (Directorate of Art)
('sch-36', 'Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta Yojna (Directorate of Art)',
 'Dr. Panjabrao Deshmukh Hostel Allowance (Art)',
 'Directorate of Art, Maharashtra', 'Foundation, Diploma, Degree in Fine Arts', 'Children of Marginal Farmers Enrolled in Art',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹20,000 to ₹30,000 / Year Cash Hostel Allowance',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'HOSTEL_RENT_PROOF', '7/12_LAND_RECORD'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Choose Hostel Maintenance Allowance under Directorate of Art on MahaDBT.\n2. Declare private rental address in Mumbai/Pune art college cluster.\n3. Submit application.',
 '1. Submit verified rent receipts and art college bonafide to scholarship desk.\n2. Institution approves accommodation records and submits proposal to DOA.\n3. Maintenance funds are deposited into the student\'s bank account.',
 NULL, TRUE, TRUE, FALSE, FALSE, 'all', 'Fine Arts', 'hostel_stipend', 'active'),

-- 37. Rajarshi Chhatrapati Shahu Maharaj Fee Waiver (Agriculture Universities)
('sch-37', 'Rajarshi Chhatrapati Shahu Maharaj Fee Waiver (Agriculture Universities)',
 'RCSM Fee Waiver for Agriculture Courses',
 'Department of Agriculture (MCAER)', 'B.Sc. (Agri), B.Tech (Agri Engg), Horticulture, Food Tech', 'OPEN, EWS Agriculture Students',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '50% Tuition Fee & Exam Fee Waiver',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'MCAER_ALLOTMENT', 'AGRI_COLLEGE_FEE_RECEIPT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Department Of Agriculture on MahaDBT portal.\n2. Choose RCSM Shikshan Shulkh Shishyavrutti Yojna (Agriculture).\n3. Link MCAER Centralized Admission allotment particulars.',
 '1. Submit physical application to the Agriculture College Student Welfare Office.\n2. College dean verifies MCAER seat quota and fee payment vouchers.\n3. Department of Agriculture reimburses 50% tuition fees to the university.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'Agriculture', 'general', 'active'),

-- 38. Dr. Panjabrao Deshmukh Hostel Maintenance (Agriculture Universities)
('sch-38', 'Dr. Panjabrao Deshmukh Hostel Maintenance (Agriculture Universities)',
 'Dr. Panjabrao Deshmukh Hostel Allowance (Agriculture)',
 'Department of Agriculture (MCAER)', 'Undergrad / Postgrad Agricultural Degrees', 'Children of Marginal Farmers in Agriculture Courses',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹20,000 to ₹38,000 / Year Cash',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'HOSTEL_RENT_PROOF', '7/12_LAND_EXTRACT'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Select Dr. Panjabrao Deshmukh Vasatigruh Bhatta (Agriculture) on MahaDBT.\n2. Declare off-campus hostel / rental residence; upload parent 7/12 extract.\n3. Submit application.',
 '1. Provide hostel rector certificate to the College of Agriculture registrar.\n2. Institutional officer approves application on the agriculture university portal.\n3. Direct bank transfer is credited to student\'s verified bank account.',
 NULL, TRUE, TRUE, FALSE, FALSE, 'all', 'Agriculture', 'hostel_stipend', 'active'),

-- 39. Rajarshi Chhatrapati Shahu Maharaj Fee Waiver (Animal & Fishery Sciences - MAFSU)
('sch-39', 'Rajarshi Chhatrapati Shahu Maharaj Fee Waiver (Animal & Fishery Sciences - MAFSU)',
 'RCSM Fee Waiver for Animal & Fishery Sciences',
 'Animal Husbandry & Fisheries (MAFSU Nagpur)', 'B.V.Sc. & A.H., B.F.Sc., Dairy Technology', 'OPEN, EWS Veterinary & Fishery Students',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '50% Tuition & Exam Fee Waiver',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'MAFSU_ALLOTMENT', 'VETERINARY_BONAFIDE'),
 'https://mahadbt.maharashtra.gov.in',
 '1. Choose MAFSU Nagpur scheme directory on the MahaDBT portal.\n2. Select RCSM Fee Reimbursement Scheme; enter veterinary admission quota.\n3. Submit application.',
 '1. Submit verified dossier to Veterinary/Fisheries College Academic Cell.\n2. University accounts section certifies tuition fees against state rules.\n3. MAFSU releases 50% fee concession on the student\'s institutional ledger.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'Veterinary', 'general', 'active'),

-- 40. Vocational Training Fee Reimbursement for Open (EWS) & SEBC (DVET)
('sch-40', 'Vocational Training Fee Reimbursement for Open (EWS) & SEBC (DVET)',
 'Vocational Training Fee Reimbursement (DVET)',
 'Directorate of Vocational Education & Training', 'Craftsman Training Scheme (CTS / ITI)', 'ITI Craftsman Trainees (Open EWS / SEBC)',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '100% Approved Trade Training Fee Waiver',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', '10TH_MARKSHEET', 'DVET_ALLOTMENT_SLIP'),
 'https://admission.dvet.gov.in',
 '1. Log in using candidate DVET admission registration credentials.\n2. Select Craftsmen Training Scheme Fee Reimbursement Module.\n3. Confirm government trade seat allotment and enter bank passbook info.',
 '1. Submit admission allotment receipt to the ITI Accounts Office.\n2. Present original Income Certificate for institutional verification.\n3. Reimbursement is credited directly to the student\'s bank account.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'all', 'ITI', 'general', 'active'),

-- 41. AICTE Pragati Scholarship for Girl Students (Degree & Diploma)
('sch-41', 'AICTE Pragati Scholarship for Girl Students (Degree & Diploma)',
 'AICTE Pragati Scholarship for Girl Students',
 'AICTE / Ministry of Education', '1st Year Engineering / Pharmacy Degree/Dip', 'Female Students in Technical Education',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹50,000 / Year Fixed Cash Grant',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'INCOME_CERT', '10TH_12TH_MARKSHEET', 'CAP_ALLOTMENT', 'PRAGATI_FAMILY_AFFIDAVIT'),
 'https://scholarships.gov.in',
 '1. Complete One-Time Registration (OTR) on the National Scholarship Portal.\n2. Select AICTE Section > Pragati Scholarship Scheme For Girl Students.\n3. Enter college AISHE code, course roll number, and CAP allotment details.',
 '1. Submit physical copies of marksheets and CAP allotment to college INO.\n2. Attach signed affidavit confirming no more than 2 girls claim the benefit.\n3. National Merit List generation and DBT disbursal handled by AICTE Delhi.',
 NULL, FALSE, FALSE, TRUE, FALSE, 'female', 'Engineering', 'merit_scholarship', 'active'),

-- 42. AICTE Saksham Scholarship for Differently-Abled Students
('sch-42', 'AICTE Saksham Scholarship for Differently-Abled Students',
 'AICTE Saksham Scholarship for Differently-Abled Students',
 'AICTE / Ministry of Education', '1st Year Technical Degree / Diploma', 'Differently-Abled Technical Students (Disability ≥ 40%)',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹50,000 / Year Fixed Grant',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'DISABILITY_UDID', 'INCOME_CERT', 'CAP_ALLOTMENT', 'BONAFIDE_CERT'),
 'https://scholarships.gov.in',
 '1. Log in to NSP via OTR; select AICTE > Saksham Scholarship Scheme.\n2. Enter Unique Disability ID (UDID) card number and verified percentage.\n3. Submit application for institutional verification.',
 '1. Present original UDID Card / Disability Certificate to the INO.\n2. Institute Nodal Officer verifies disability credentials against physical records.\n3. AICTE sanctions direct annual transfer of ₹50,000 to the student\'s bank account.',
 NULL, FALSE, FALSE, TRUE, TRUE, 'all', 'Engineering', 'special_concession', 'active'),

-- 43. AICTE Swanath Scholarship for Orphans & Wards of Armed Forces Martyrs
('sch-43', 'AICTE Swanath Scholarship for Orphans & Wards of Armed Forces Martyrs',
 'AICTE Swanath Scholarship',
 'AICTE / Ministry of Education', 'Technical Degree / Diploma Programs', 'Orphans, Wards of Martyrs & Covid Victims',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹50,000 / Year Educational Grant',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'ORPHAN_CERT', 'DEFENCE_MARTYR_CERT', 'COLLEGE_BONAFIDE'),
 'https://scholarships.gov.in',
 '1. Choose AICTE Swanath Scholarship under the AICTE section on NSP.\n2. Upload death certificates / Competent Authority orphan certification.\n3. Submit form.',
 '1. College INO verifies orphan status or Armed Forces casualty certificate.\n2. Institutional clearance is processed on the NSP portal.\n3. AICTE credits ₹50,000 directly to the student\'s account annually.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'Engineering', 'special_concession', 'active'),

-- 44. Central Sector Scheme of Scholarship for College & University Students (DoHE)
('sch-44', 'Central Sector Scheme of Scholarship for College & University Students (DoHE)',
 'Central Sector Scheme of Scholarship (CSSS)',
 'Department of Higher Education (MoE, GoI)', 'Regular UG (₹12k/Yr) & PG (₹20k/Yr)', 'Top 20th Percentile in Maharashtra State Board HSC',
 450000.00, '≤ ₹4,50,000 / Year', 80.00, '₹12,000 to ₹20,000 / Year Cash',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'HSC_MARKSHEET', 'INCOME_CERT', 'COLLEGE_BONAFIDE', 'BANK_PASSBOOK'),
 'https://scholarships.gov.in',
 '1. Register on NSP; choose Department of Higher Education > Central Sector Scheme.\n2. Validate Maharashtra HSC Board Seat Number against MSBSHSE merit roster.\n3. Submit electronic form.',
 '1. Submit printed NSP form with self-attested 12th marksheet to college INO.\n2. College INO executes online verification on the NSP portal.\n3. Ministry of Education sanctions direct benefit transfer.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active'),

-- 45. DST INSPIRE Scholarship for Higher Education (SHE)
('sch-45', 'DST INSPIRE Scholarship for Higher Education (SHE)',
 'DST INSPIRE Scholarship (SHE)',
 'Department of Science & Technology (DST, GoI)', 'B.Sc., B.S., Integrated M.Sc. in Natural Sciences', 'Top 1% in Class 12 pursuing Basic Sciences',
 NULL, 'Purely Merit Based (No Income Limit)', 95.00, '₹80,000 / Year (₹60k Cash + ₹20k Research Grant)',
 '2026-12-31', JSON_ARRAY('AADHAAR', '12TH_MARKSHEET', 'ADVISORY_NOTE', 'SCIENCE_INSTITUTE_BONAFIDE'),
 'https://online-inspire.gov.in',
 '1. Create account on the DST INSPIRE Online Portal.\n2. Upload Maharashtra Board Top 1% Advisory Note and admission proof in pure sciences.\n3. Submit annual application.',
 '1. College Principal validates full-time enrollment in natural/basic sciences.\n2. Complete mandatory summer research project under a recognized mentor.\n3. DST remits ₹80,000 annually into the scholar\'s SBI account.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'Science', 'merit_scholarship', 'active'),

-- 46. Prime Minister\'s Scholarship Scheme (PMSS) for Wards of Ex-Servicemen & CAPF
('sch-46', 'Prime Minister\'s Scholarship Scheme (PMSS) for Wards of Ex-Servicemen & CAPF',
 'PMSS for Wards of Ex-Servicemen & CAPF',
 'Ministry of Home Affairs / Kendriya Sainik Board (KSB)', 'Professional Degree (BE, B.Tech, MBBS, BDS, MBA, MCA)', 'Wards & Widows of CAPF, AR & Ex-Servicemen',
 NULL, 'Service-Linked Priority Categories', 60.00, '₹3,000/Mo for Girls; ₹2,50/Mo for Boys',
 '2026-10-31', JSON_ARRAY('DISCHARGE_BOOK', 'PPO_COPY', 'WAR_MARTYR_CERT', 'COLLEGE_BONAFIDE'),
 'https://scholarships.gov.in',
 '1. Register on NSP under WARB / MHA / KSB PMSS module.\n2. Upload ESM Pension Payment Order (PPO), Discharge Book, and relationship affidavit.\n3. Submit application.',
 '1. Zilla Sainik Welfare Office (ZSWO) / Police Welfare Officer conducts physical audit.\n2. Institute Nodal Officer completes institutional verification on NSP.\n3. Kendriya Sainik Board deposits monthly stipend annually into the scholar\'s account.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'Engineering', 'special_concession', 'active'),

-- 47. Central Post-Matric Scholarship for Students of Notified Minority Communities
('sch-47', 'Central Post-Matric Scholarship for Students of Notified Minority Communities',
 'Central Post-Matric Scholarship for Minorities',
 'Ministry of Minority Affairs (MoMA, GoI)', 'Class 11, 12, Diploma, UG, PG', 'Muslims, Christians, Sikhs, Buddhists, Jains, Parsis',
 200000.00, '≤ ₹2,00,000 / Year', 50.00, 'Full Admission/Tuition Fee + Monthly Maintenance',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'INCOME_CERT', 'MINORITY_COMMUNITY_DECLARATION', 'PREVIOUS_MARKSHEET'),
 'https://scholarships.gov.in',
 '1. Log in via OTR on the National Scholarship Portal.\n2. Select Ministry of Minority Affairs > Post Matric Scholarship Scheme.\n3. Upload minority religious self-declaration and fee structure.',
 '1. College INO executes online verification on the NSP portal.\n2. State Minority Welfare Department conducts secondary scrutiny.\n3. MoMA sanctions funds through the Central Public Financial Management System (PFMS).',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 48. Maharashtra BOCW Construction Workers Educational Assistance
('sch-48', 'Maharashtra BOCW Construction Workers Educational Assistance',
 'Maharashtra BOCW Educational Assistance',
 'Maharashtra BOCW Welfare Board', 'Class 1 to Degree, Engineering, MBBS', 'Children of Registered Construction Laborers',
 NULL, 'Active BOCW Registration (No Income Cap)', 0.00, '₹2,500 to ₹1,00,000 / Year Grant',
 '2027-03-31', JSON_ARRAY('AADHAAR', 'BOCW_SMART_CARD', '90_DAYS_WORK_CERT', 'SCHOOL_COLLEGE_BONAFIDE', 'FEE_RECEIPT'),
 'https://mahabocw.in',
 '1. Log into MahaBOCW portal with registered worker smart card number.\n2. Go to Welfare Schemes > Educational Assistance Claim Form.\n3. Enter student\'s enrolled standard/course and academic admission year.',
 '1. Attach verified Bonafide Certificate and academic fee receipts.\n2. Include parent 90-day working certificate issued by registered contractor.\n3. Direct Aadhaar-linked DBT transfer follows labor board approval.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'special_concession', 'active'),

-- 49. Mukhyamantri Yuva Karya Prashikshan Yojana (Internship Stipend)
('sch-49', 'Mukhyamantri Yuva Karya Prashikshan Yojana (Internship Stipend)',
 'Mukhyamantri Yuva Karya Prashikshan Yojana',
 'Department of Skills, Employment & Innovation', '12th Pass, ITI, Diploma, Graduate / Post-Graduate', 'Maharashtra Educated Youth (Age 18–35)',
 NULL, 'No Family Income Ceiling', 0.00, '₹6,000 (12th/ITI), ₹8,000 (Dip), ₹10,000 (Degree) / Mo (6 Months Internship)',
 '2027-03-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'DEGREE_DIPLOMA_CERT', 'MAHASWAYAM_REGISTRATION'),
 'https://rojgar.mahaswayam.gov.in',
 '1. Register on the MahaSwayam employment exchange portal.\n2. Apply for published internship openings across government/private enterprises.\n3. Complete employer digital interview and appointment acceptance.',
 '1. Report to assigned training establishment; record daily biometric attendance.\n2. Establishment submits monthly attendance log to District Skill Development Officer.\n3. Stipend is credited on the 10th of every month via DBT.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'general', 'active'),

-- 50. Free Bicycle Assistance for Rural Girls (ZP Manodnya Scheme)
('sch-50', 'Free Bicycle Assistance for Rural Girls (ZP Manodnya Scheme)',
 'Free Bicycle Assistance for Rural Girls (ZP Manodnya)',
 'School Education & District Zilla Parishads', 'Classes 8, 9, 10', 'Rural Girl Students (Secondary School)',
 100000.00, '≤ ₹1,00,000 / BPL Ration Card', 0.00, 'Free Brand Bicycle or ₹3,500 DBT Grant',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'SCHOOL_BONAFIDE', 'BPL_RATION_CARD', 'DISTANCE_CERT'),
 'https://rdd.maharashtra.gov.in',
 '1. Obtain physical application form from school headmaster or Gram Panchayat.\n2. Attach student Aadhaar, Domicile, and family BPL/Ration Card photocopy.\n3. Secure distance certificate confirming ≥ 2 km commute from Gram Sevak.',
 '1. Headmaster compiles eligible applicant list and submits to BEO.\n2. BEO consolidates taluka rosters and forwards to ZP Education Officer.\n3. Bicycles are distributed directly at the school during the academic term.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'female', 'all', 'special_concession', 'active'),

-- 51. National Means-cum-Merit Scholarship Scheme (NMMSS - School Education)
('sch-51', 'National Means-cum-Merit Scholarship Scheme (NMMSS - School Education)',
 'National Means-cum-Merit Scholarship Scheme (NMMSS)',
 'Department of School Education (MoE, GoI / MSCE Pune)', 'Secondary Education (Classes 9 to 12)', 'Meritorious Students in Government/Aided Schools',
 350000.00, '≤ ₹3,50,000 / Year', 55.00, '₹12,000 / Year (₹1,000 / Month) for 4 Years',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'NMMS_SELECTION_CERT', 'INCOME_CERT', 'SCHOOL_BONAFIDE'),
 'https://scholarships.gov.in',
 '1. Candidate appears for NMMS exam conducted in Class 8 by MSCE Pune.\n2. Selected meritorious candidates register on NSP under the NMMSS tab.\n3. Submit application for classes 9 through 12.',
 '1. School Headmaster verifies regular school promotion on the NSP portal.\n2. District Education Officer (Secondary) confirms continuity of study.\n3. MoE disburses ₹12,000 annually directly into the student\'s account.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active'),

-- 52. Chhatrapati Shahu Maharaj National Research Fellowship (CSMNRF - SARTHI)
('sch-52', 'Chhatrapati Shahu Maharaj National Research Fellowship (CSMNRF - SARTHI)',
 'CSMNRF SARTHI Research Fellowship',
 'Chhatrapati Shahu Maharaj Research Training Institute (SARTHI)', 'Regular Full-Time M.Phil / Ph.D. in Recognized Universities', 'Maratha, Kunbi-Maratha & SEBC PhD Scholars',
 800000.00, '≤ ₹8,00,000 / Year', 55.00, '₹31,000 to ₹35,000 / Month JRF/SRF + Annual Contingency',
 '2026-12-31', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'SEBC_CASTE_CERT', 'PHD_REGISTRATION_LETTER', 'ANNUAL_INCOME_CERT'),
 'https://sarthi-maharashtragov.in',
 '1. Register on the SARTHI Pune fellowship portal during the active call.\n2. Upload Ph.D. registration confirmation letter, synopsis, and RAC clearance.\n3. Submit form and download acknowledgment slip.',
 '1. Attend physical verification of Ph.D. logbook at SARTHI Headquarters, Pune.\n2. Research guide and university registrar sign quarterly progress reports.\n3. SARTHI deposits monthly research stipend via direct benefit transfer.',
 NULL, FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'merit_scholarship', 'active');


-- --------------------------------------------------------------------
-- 5. ALL 7 HARDWARE / TABLET / LAPTOP SCHEMES (Extracted from Hardware Manual)
-- --------------------------------------------------------------------
INSERT INTO schemes (
  id, title, scheme_name, department, level, target_audience,
  income_limit, income_limit_text, min_academic_percentage, benefit_details,
  deadline, required_documents, portal_url, online_sop, offline_sop,
  hardware_delivered, requires_hostel, requires_marginal_farmer,
  requires_cap_allotment, requires_disability, gender_restriction,
  stream_restriction, scheme_category, status
) VALUES
-- H1. Mahajyoti Free Tablet & 6GB/Day Data Scheme
('hw-01', 'Mahajyoti Free Tablet & 6GB/Day Data Scheme for MHT-CET / NEET / JEE',
 'Mahajyoti Free Tablet & 6GB/Day Data Scheme',
 'Mahajyoti Nagpur (Bahujan Kalyan)', 'Class 11 Science (State Board / CBSE)', 'OBC, VJNT, SBC Science Students',
 800000.00, 'Non-Creamy Layer (NCL) Valid (≤ ₹8,00,000 / Year)', 60.00, 'Free 4G/5G Tablet + Daily SIM Internet Data',
 '2026-11-30', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'CASTE_CERT', 'NCL_CERT', '10TH_MARKSHEET', '11TH_SCIENCE_BONAFIDE'),
 'https://mahajyoti.org.in',
 '1. Navigate to mahajyoti.org.in > Notice Board > Application for MHT-CET/JEE/NEET Tablet Training.\n2. Upload self-attested 10th marksheet (≥ 60% aggregate) and 11th Science college admission receipt.\n3. Select nearest district headquarters for device distribution camp allotment.',
 '1. District Social Welfare Officer audits original NCL and caste credentials.\n2. Selected merit list students receive SMS call letter with QR voucher.\n3. Student presents Aadhaar biometric authentication at designated government camp to collect sealed tablet.',
 '4G/5G Tablet + Daily SIM Internet Data', FALSE, FALSE, FALSE, FALSE, 'all', 'Science', 'hardware_device', 'active'),

-- H2. BARTI Competitive Exam Pre-Training Tablet & Stipend Scheme
('hw-02', 'BARTI Competitive Exam Pre-Training Tablet & Stipend Scheme',
 'BARTI Competitive Exam Pre-Training Tablet & Stipend Scheme',
 'BARTI Pune (Social Justice Dept)', 'Class 11 Science & Competitive Aspirants', 'Scheduled Caste (SC) Students',
 800000.00, '≤ ₹8,00,000 / Year', 50.00, 'Free E-Learning Tablet + ₹6,000/Mo Stipend',
 '2026-12-15', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'SC_CASTE_CERT', 'CASTE_VALIDITY', 'INCOME_CERT', 'ENROLLMENT_SLIP'),
 'https://cpetp.barti.in',
 '1. Register on the BARTI Competitive Pre-Examination Training portal (cpetp.barti.in).\n2. Select JEE/NEET or Civil Services Coaching Device Assistance.\n3. Upload caste certificate, caste scrutiny validity, and qualifying marksheets.',
 '1. Appear for entrance exam or screening at designated regional BARTI centers.\n2. Sign an undertaking that no parallel state gadget scheme has been claimed.\n3. Hardware issued with preloaded syllabus software and mobile device management (MDM).',
 'Android E-Learning Tablet + Preloaded LMS', FALSE, FALSE, FALSE, FALSE, 'all', 'Science', 'hardware_device', 'active'),

-- H3. TRTI Free E-Learning Tablet Scheme for Tribal Science Students
('hw-03', 'TRTI Free E-Learning Tablet Scheme for Tribal Science Students',
 'TRTI Free E-Learning Tablet Scheme for Tribal Students',
 'Tribal Research & Training Institute (TRTI Pune)', 'Class 11 Science (NEET / JEE / MHT-CET)', 'Scheduled Tribe (ST) Science Students',
 250000.00, '≤ ₹2,50,000 / Year', 50.00, 'Free 10-Inch Tablet with Preloaded NEET/JEE Content',
 '2026-12-20', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'ST_CASTE_CERT', 'TRIBE_VALIDITY', '10TH_MARKSHEET', 'SCIENCE_COLLEGE_BONAFIDE'),
 'https://trti.maharashtra.gov.in',
 '1. Open Schemes tab on trti.maharashtra.gov.in > NEET/JEE Tablet Support.\n2. Upload ST Caste Validity certificate and 10th standard aggregate marksheet.\n3. Submit junior college admission bonafide certificate with stream confirmation.',
 '1. Project Officer, Integrated Tribal Development Project (ITDP) audits physical copies.\n2. Selected tribal students report to ITDP project office on designated date.\n3. Device distributed with preloaded interactive test modules and digital textbooks.',
 '10-Inch Tablet + NEET/JEE Content Pack', FALSE, FALSE, FALSE, FALSE, 'all', 'Science', 'hardware_device', 'active'),

-- H4. SARTHI Digital Learning Device Assistance for Maratha / SEBC Aspirants
('hw-04', 'SARTHI Digital Learning Device Assistance for Maratha / SEBC Aspirants',
 'SARTHI Digital Tablet Coaching Initiative',
 'Chhatrapati Shahu Maharaj Research (SARTHI Pune)', 'Competitive Pre-Coaching / Higher Technical', 'Maratha, Kunbi-Maratha & SEBC Students',
 800000.00, '≤ ₹8,00,000 / Year (Valid NCL)', 55.00, 'Free Android Tablet + Monthly Prep Allowance',
 '2026-12-25', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'SEBC_CASTE_CERT', 'NCL_CERT', 'SARTHI_CET_HALL_TICKET'),
 'https://sarthi-maharashtragov.in',
 '1. Register on sarthi-maharashtragov.in during active notification window.\n2. Submit candidate profile with SEBC certificate and academic performance credentials.\n3. Select preference for online training track requiring dedicated learning tablet.',
 '1. Appear for verification at SARTHI Pune headquarters or regional sub-centers.\n2. Sign statutory receipt acknowledging government property and academic utility.\n3. Device handed over with pre-installed study software and test series.',
 'Free Tablet + Prep Course Software', FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'hardware_device', 'active'),

-- H5. BMC Municipal School Free Digital Tablet Distribution Scheme
('hw-05', 'BMC Municipal School Free Digital Tablet Distribution Scheme',
 'BMC Municipal School Digital Tablet Scheme',
 'Brihanmumbai Municipal Corporation (BMC)', 'Standard 9 Enrolled Students in Mumbai', 'Students in Civic-Run Secondary Schools',
 NULL, 'Civic School Enrollment (No Income Ceiling)', 0.00, 'Free Android Tablet Preloaded with SSC Syllabus (1-Yr Warranty + 4-Yr Support)',
 '2026-11-30', JSON_ARRAY('STUDENT_AADHAAR', 'MUNICIPAL_SCHOOL_ID', 'PARENT_CONSENT_FORM', 'SCHOOL_ROLL_REGISTER'),
 'https://bmceducation.in',
 '1. BMC Education Department generates unified list of regular Class 9 students across civic schools.\n2. School Headmaster verifies student enrollment and biometric attendance on BMC Education portal.\n3. Parents execute standard maintenance and usage agreement with school headmaster.',
 '1. Procurement agency delivers serialized, barcoded tablets to municipal school premises.\n2. Class teacher maps student unique pupil ID (SARAL ID) to tablet IMEI number.\n3. Tablet distributed to student during school assembly; technical support desk assigned per ward.',
 'Class 9 Free Learning Tablet with Warranty', FALSE, FALSE, FALSE, FALSE, 'all', 'all', 'hardware_device', 'active'),

-- H6. Assistance to Disabled Persons for Purchase of Aids (ADIP) Assistive Laptop Scheme
('hw-06', 'Assistance to Disabled Persons for Purchase of Aids (ADIP) Assistive Laptop Scheme',
 'DEPwD ADIP Assistive Laptop Scheme for PwD',
 'DEPwD / Ministry of Social Justice (GoI) & ALIMCO', 'Higher Secondary, Degree, Postgrad & Professional', 'Visually / Orthopedically Impaired Students',
 360000.00, '≤ ₹30,000 / Month (100% Grant up to ₹22,500/Mo)', 0.00, 'Free Laptop with Screen Reader (JAWS/NVDA) or Daisy Player',
 '2027-03-31', JSON_ARRAY('AADHAAR', 'UDID_DISABILITY_CARD', 'INCOME_CERT', 'COLLEGE_RECOMMENDATION_LETTER', 'BONAFIDE_CERT'),
 'https://depwd.gov.in/en/adip/',
 '1. Register on the Ministry\'s ARJUN Portal (depwd.gov.in/en/adip/).\n2. Enter 18-digit Unique Disability ID (UDID) number to auto-verify benchmark impairment.\n3. Select requested assistive hardware category: Laptop with Screen Reading Software.',
 '1. District Disability Rehabilitation Centre (DDRC) or Civil Surgeon validates fitment recommendation.\n2. Attend designated ALIMCO distribution camp or Composite Regional Centre (CRC).\n3. Certified, specialized accessible laptop handed over with warranty and assistive peripherals.',
 'Screen-Reader Laptop / Daisy Player', FALSE, FALSE, FALSE, TRUE, 'all', 'all', 'hardware_device', 'active'),

-- H7. AICTE Pragati & Saksham Statutory Computer / Laptop Purchase Grant
('hw-07', 'AICTE Pragati & Saksham Statutory Computer / Laptop Purchase Grant',
 'AICTE Pragati & Saksham Laptop Grant',
 'AICTE / Ministry of Education (GoI)', '1st Year / 2nd Year Lateral Entry (Degree / Diploma)', 'Girl Students (Pragati) / Specially-Abled (Saksham)',
 800000.00, '≤ ₹8,00,000 / Year', 0.00, '₹50,000/Yr for Laptop/PC & Software',
 '2026-10-31', JSON_ARRAY('AADHAAR', 'INCOME_CERT', 'CAP_ALLOTMENT', 'COLLEGE_BONAFIDE', 'PURCHASE_INVOICE_BILL'),
 'https://scholarships.gov.in',
 '1. Register via OTR on scholarships.gov.in > AICTE Section > Pragati / Saksham Scheme.\n2. Submit academic enrollment, CAP seat confirmation, and parental income credentials.\n3. Select direct payment grant mode (entitles candidate to ₹50,000/year lump-sum).',
 '1. College Institute Nodal Officer (INO) verifies student technical enrollment on NSP.\n2. AICTE transfers ₹50,000 directly via DBT into student\'s Aadhaar-seeded bank account.\n3. Student purchases preferred laptop/computer and submits GST invoice copy to college record.',
 '₹50,000/Yr for Laptop/PC & Software Procurement', FALSE, FALSE, TRUE, FALSE, 'female', 'Engineering', 'hardware_device', 'active');


-- --------------------------------------------------------------------
-- 6. SAMPLE TEACHER GUIDANCE REQUESTS & WORKFLOW INBOX
-- --------------------------------------------------------------------
INSERT INTO guidance_requests (
  id, student_id, scheme_id, request_type, request_message,
  attached_documents, status, strict_compliance_check, compliance_details,
  teacher_notes, reviewed_by, reviewed_at
) VALUES
('req-101', 'student-1', 'sch-01', 'scheme_application',
 'Respected Sir, I have secured admission in B.Tech via CAP quota under EWS category. Our family income is ₹2.2 LPA. Kindly verify my eligibility for 50% tuition fee waiver and approve my Mahadbt institutional verification.',
 JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CAP_ALLOTMENT', 'BONAFIDE_CERT', 'FEE_RECEIPT'),
 'pending', TRUE,
 JSON_OBJECT('category_matched', TRUE, 'income_matched', TRUE, 'academic_matched', TRUE, 'level_matched', TRUE, 'all_criteria_met', TRUE),
 NULL, NULL, NULL),

('req-102', 'student-1', 'sch-02', 'scheme_application',
 'Sir, I stay in off-campus rental room near COEP as hostel seats were full. My parents are marginal farmers with 7/12 land extract. Requesting approval for Dr. Panjabrao Deshmukh Vasatigruh Nirvah Bhatta.',
 JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'HOSTEL_RENT_PROOF', '7/12_LAND_EXTRACT'),
 'pending', TRUE,
 JSON_OBJECT('category_matched', TRUE, 'income_matched', TRUE, 'hostel_matched', TRUE, 'marginal_farmer_matched', TRUE, 'all_criteria_met', TRUE),
 NULL, NULL, NULL),

('req-103', 'student-2', 'sch-25', 'scheme_application',
 'Respected Teacher, I am enrolled in B.Sc. Physics, OBC category with valid Non-Creamy Layer (NCL) certificate. Family income is ₹1.2 LPA. Requesting verification for Post-Matric Scholarship.',
 JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'CASTE_VALIDITY', 'NCL_CERT'),
 'approved', TRUE,
 JSON_OBJECT('category_matched', TRUE, 'income_matched', TRUE, 'academic_matched', TRUE, 'all_criteria_met', TRUE),
 'Verified original NCL valid till March 2027 and Caste Validity certificate. Forwarded to District Social Welfare Officer queue on MahaDBT.',
 'user-teacher-1', '2026-09-24 11:30:00'),

('req-104', 'student-4', 'hw-06', 'scheme_application',
 'Respected Sir, I have 45% locomotor benchmark disability with a verified digital UDID card. Enrolled in B.Tech 2nd Year. I wish to apply for the ADIP assistive screen-reader laptop scheme.',
 JSON_ARRAY('AADHAAR', 'UDID_DISABILITY_CARD', 'INCOME_CERT', 'COLLEGE_BONAFIDE'),
 'document_reupload_requested', FALSE,
 JSON_OBJECT('category_matched', TRUE, 'income_matched', FALSE, 'disability_matched', TRUE, 'all_criteria_met', FALSE, 'failure_reasons', JSON_ARRAY('Family income (₹7,50,000) exceeds ADIP monthly ceiling limit of ₹30,000/Mo (₹3.6 LPA)')),
 'Income certificate shows ₹7.5 LPA, which exceeds the ADIP scheme ceiling (₹3.6 LPA). Please upload fresh income assessment certificate or apply for AICTE Saksham grant instead.',
 'user-teacher-1', '2026-09-25 14:15:00'),

('req-105', 'student-3', 'hw-02', 'scheme_application',
 'Sir, I am in Class 11 Science preparing for MHT-CET and JEE. Applying for the BARTI Pune Android E-learning tablet and monthly prep assistance.',
 JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'SC_CASTE_CERT', 'CASTE_VALIDITY', 'INCOME_CERT', 'ENROLLMENT_SLIP'),
 'pending', TRUE,
 JSON_OBJECT('category_matched', TRUE, 'income_matched', TRUE, 'academic_matched', TRUE, 'stream_matched', TRUE, 'all_criteria_met', TRUE),
 NULL, NULL, NULL);

-- --------------------------------------------------------------------
-- 7. INITIAL STUDENT TRACKING RECORDS
-- --------------------------------------------------------------------
INSERT INTO student_scheme_tracking (student_id, scheme_id, status, ready_documents, last_updated) VALUES
('student-1', 'sch-01', 'submitted_online', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CAP_ALLOTMENT'), '2026-09-20'),
('student-1', 'sch-02', 'preparing', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', '7/12_LAND_EXTRACT'), '2026-09-21'),
('student-2', 'sch-25', 'offline_verified', JSON_ARRAY('AADHAAR', 'DOMICILE_MH', 'INCOME_CERT', 'CASTE_CERT', 'NCL_CERT'), '2026-09-24');
