import { DocumentInfo } from '../types';

export const DOCUMENTS_DATA: Record<string, DocumentInfo> = {
  AADHAAR: {
    id: 'AADHAAR',
    name: 'Aadhaar Card (UIDAI)',
    description: 'Mandatory government 12-digit biometric identity card with updated mobile and active bank seeding (NPCI DBT enabled).',
    issuingAuthority: 'Unique Identification Authority of India (UIDAI)',
    portalLink: 'https://myaadhaar.uidai.gov.in',
    tag: 'Identity'
  },
  DOMICILE_MH: {
    id: 'DOMICILE_MH',
    name: 'Maharashtra Domicile Certificate',
    description: 'Certificate proving permanent residency in Maharashtra State (minimum 15 years domicile requirement).',
    issuingAuthority: 'Tehsildar / Sub-Divisional Officer (Aaple Sarkar)',
    portalLink: 'https://aaplesarkar.mahaonline.gov.in',
    tag: 'Residency'
  },
  INCOME_CERT: {
    id: 'INCOME_CERT',
    name: 'Annual Family Income Certificate',
    description: 'Official income certificate for the current financial year issued by a Competent Revenue Officer (Tehsildar rank).',
    issuingAuthority: 'Tahsil Office / Revenue Department',
    portalLink: 'https://aaplesarkar.mahaonline.gov.in',
    tag: 'Financial'
  },
  CASTE_CERT: {
    id: 'CASTE_CERT',
    name: 'Caste Certificate (SC/ST/VJNT/OBC/SBC)',
    description: 'Permanent caste certificate verifying student belongs to the recognized backward class category in Maharashtra.',
    issuingAuthority: 'Sub-Divisional Officer (SDO) / Executive Magistrate',
    portalLink: 'https://aaplesarkar.mahaonline.gov.in',
    tag: 'Category'
  },
  CASTE_VALIDITY: {
    id: 'CASTE_VALIDITY',
    name: 'Caste Scrutiny Validity Certificate',
    description: 'Statutory certificate issued by the Divisional Caste Scrutiny Committee confirming authentic validity of caste claim.',
    issuingAuthority: 'Divisional Caste Scrutiny Committee (BARTI / SJSA)',
    portalLink: 'https://bartievalidity.maharashtra.gov.in',
    tag: 'Category'
  },
  NCL_CERT: {
    id: 'NCL_CERT',
    name: 'Non-Creamy Layer Certificate (NCL)',
    description: 'Current active Non-Creamy Layer certificate certifying family income is within statutory OBC/VJNT/SBC creamy layer limits.',
    issuingAuthority: 'Sub-Divisional Officer / Tehsildar',
    portalLink: 'https://aaplesarkar.mahaonline.gov.in',
    tag: 'Category'
  },
  CAP_ALLOTMENT: {
    id: 'CAP_ALLOTMENT',
    name: 'CAP Round Seat Allotment Letter',
    description: 'Official Centralized Admission Process (CAP) allotment letter issued by State CET Cell / DTE confirming quota admission.',
    issuingAuthority: 'State Common Entrance Test (CET) Cell / DTE Maharashtra',
    portalLink: 'https://cetcell.mahacet.org',
    tag: 'Academic'
  },
  BONAFIDE_CERT: {
    id: 'BONAFIDE_CERT',
    name: 'College Current Bonafide Certificate',
    description: 'Institutional certificate certifying regular full-time enrolled student status for the ongoing academic year.',
    issuingAuthority: 'Principal / Registrar of Enrolled College',
    tag: 'Academic'
  },
  FEE_RECEIPT: {
    id: 'FEE_RECEIPT',
    name: 'Approved College Fee Receipt',
    description: 'Official stamped fee receipt from college accounts division detailing tuition, library, exam, and laboratory fee breakups.',
    issuingAuthority: 'College Accounts Section',
    tag: 'Financial'
  },
  HOSTEL_RENT_PROOF: {
    id: 'HOSTEL_RENT_PROOF',
    name: 'Hostel Certificate / Certified Rent Agreement',
    description: 'Registered rental agreement with landlord contact/PAN or college hostel rector admission certificate.',
    issuingAuthority: 'Hostel Rector / Certified Landlord & Notary',
    tag: 'Residential'
  },
  '7/12_LAND_EXTRACT': {
    id: '7/12_LAND_EXTRACT',
    name: '7/12 Land Extract (Marginal Farmer Proof)',
    description: 'Recent digitized 7/12 land holding extract from Revenue Talathi proving marginal/small farmer landholding in Maharashtra.',
    issuingAuthority: 'Revenue Department / Mahabhumi Portal (Talathi)',
    portalLink: 'https://bhulekh.mahabhumi.gov.in',
    tag: 'Special'
  },
  '7/12_LAND_RECORD': {
    id: '7/12_LAND_RECORD',
    name: '7/12 Land Record (Parent Agriculturist Proof)',
    description: 'Parent land record extract verifying family agricultural status for specialized hostel maintenance grants.',
    issuingAuthority: 'Revenue Department / Mahabhumi Portal',
    portalLink: 'https://bhulekh.mahabhumi.gov.in',
    tag: 'Special'
  },
  HOSTEL_NON_ADMISSION_CERT: {
    id: 'HOSTEL_NON_ADMISSION_CERT',
    name: 'Government Hostel Non-Admission Certificate',
    description: 'Confirmation certificate proving non-availability of vacancy in government social welfare/tribal hostels in college city.',
    issuingAuthority: 'Superintendent, Government Hostel / Social Welfare Office',
    tag: 'Residential'
  },
  DISABILITY_UDID: {
    id: 'DISABILITY_UDID',
    name: 'Unique Disability ID (UDID Card)',
    description: 'Digital UDID Smart Card issued by Medical Board / Civil Surgeon verifying benchmark disability percentage of 40% or more.',
    issuingAuthority: 'Department of Empowerment of Persons with Disabilities / Civil Surgeon',
    portalLink: 'https://www.swavlambancard.gov.in',
    tag: 'Special'
  },
  UDID_DISABILITY_CARD: {
    id: 'UDID_DISABILITY_CARD',
    name: 'UDID Disability Card (Benchmark ≥ 40%)',
    description: 'Permanent national disability card for assistive hardware/laptop screen-reader fitment.',
    issuingAuthority: 'District Civil Surgeon / Medical Board',
    portalLink: 'https://www.swavlambancard.gov.in',
    tag: 'Special'
  },
  '10TH_MARKSHEET': {
    id: '10TH_MARKSHEET',
    name: 'SSC (Class 10) Passing Marksheet',
    description: 'Maharashtra State Board / CBSE / ICSE Class 10 examination marksheet indicating aggregate qualifying score.',
    issuingAuthority: 'State Board of Secondary & Higher Secondary Education (MSBSHSE)',
    tag: 'Academic'
  },
  '12TH_HSC_MARKSHEET': {
    id: '12TH_HSC_MARKSHEET',
    name: 'HSC (Class 12) Passing Marksheet',
    description: 'Class 12 examination board marksheet verifying stream aggregate percentage.',
    issuingAuthority: 'Maharashtra State Board (MSBSHSE)',
    tag: 'Academic'
  },
  '12TH_SCIENCE_MARKSHEET': {
    id: '12TH_SCIENCE_MARKSHEET',
    name: 'Class 12 Science Stream Marksheet',
    description: 'HSC mark statement verifying physics, mathematics, chemistry and biology marks.',
    issuingAuthority: 'MSBSHSE Board',
    tag: 'Academic'
  },
  '10TH_12TH_MARKSHEET': {
    id: '10TH_12TH_MARKSHEET',
    name: '10th & 12th Board Marksheets',
    description: 'Qualifying board examination marks certificates for AICTE and technical degree verification.',
    issuingAuthority: 'MSBSHSE / Respective State Board',
    tag: 'Academic'
  },
  UG_DEGREE_MARKSHEET: {
    id: 'UG_DEGREE_MARKSHEET',
    name: 'Undergraduate Degree Final Marksheet',
    description: 'Consolidated university degree marks statement confirming minimum 60% (Arts/Com/Law) or 70% (Science).',
    issuingAuthority: 'Recognized University Controller of Examinations',
    tag: 'Academic'
  },
  ST_CASTE_CERT: {
    id: 'ST_CASTE_CERT',
    name: 'Scheduled Tribe (ST) Certificate',
    description: 'Tribe certificate issued to notified Scheduled Tribes in Maharashtra.',
    issuingAuthority: 'Sub-Divisional Officer / Competent Authority',
    tag: 'Category'
  },
  TRIBE_VALIDITY: {
    id: 'TRIBE_VALIDITY',
    name: 'Scheduled Tribe Validity Certificate',
    description: 'Statutory Tribe Scrutiny Committee Certificate issued by Tribal Development Department (TRTI).',
    issuingAuthority: 'Tribal Scrutiny Committee (TRTI Maharashtra)',
    portalLink: 'https://etribevalidity.mahaonline.gov.in',
    tag: 'Category'
  },
  SEBC_CASTE_CERT: {
    id: 'SEBC_CASTE_CERT',
    name: 'SEBC / Maratha Caste Certificate',
    description: 'Socially and Educationally Backward Class (SEBC) certificate issued by Competent Revenue Authority.',
    issuingAuthority: 'Sub-Divisional Officer (Revenue)',
    tag: 'Category'
  },
  MINORITY_SELF_DECLARATION: {
    id: 'MINORITY_SELF_DECLARATION',
    name: 'Religious Minority Self-Declaration',
    description: 'Statutory affidavit / declaration declaring belonging to notified minority religion (Muslim, Christian, Buddhist, Jain, Sikh, Parsi).',
    issuingAuthority: 'Self-declaration endorsed with Parent/Guardian signature',
    tag: 'Category'
  },
  MINORITY_DECLARATION: {
    id: 'MINORITY_DECLARATION',
    name: 'Minority Community Self-Declaration Form',
    description: 'Prescribed standard affidavit for Non-Professional DHE courses.',
    issuingAuthority: 'Notary / Self-Declaration',
    tag: 'Category'
  },
  MINORITY_COMMUNITY_DECLARATION: {
    id: 'MINORITY_COMMUNITY_DECLARATION',
    name: 'Central Minority Community Declaration (MoMA)',
    description: 'Format prescribed by Ministry of Minority Affairs, Government of India.',
    issuingAuthority: 'National Scholarship Portal (NSP)',
    tag: 'Category'
  },
  NEET_SCORECARD: {
    id: 'NEET_SCORECARD',
    name: 'NEET UG Scorecard & Rank Card',
    description: 'Official National Eligibility cum Entrance Test scorecard with State Merit Rank (SML).',
    issuingAuthority: 'National Testing Agency (NTA)',
    portalLink: 'https://neet.nta.nic.in',
    tag: 'Academic'
  },
  AAC_CET_ALLOTMENT: {
    id: 'AAC_CET_ALLOTMENT',
    name: 'MH-AAC-CET Fine Arts Allotment Slip',
    description: 'State Common Entrance Test seat allotment for government and recognized visual arts colleges.',
    issuingAuthority: 'Directorate of Art, Maharashtra',
    tag: 'Academic'
  },
  MCAER_ALLOTMENT: {
    id: 'MCAER_ALLOTMENT',
    name: 'MCAER Agriculture Centralized Allotment',
    description: 'Allotment order for agricultural universities (B.Sc. Agriculture, Horticulture, Agricultural Engineering).',
    issuingAuthority: 'Maharashtra Council of Agricultural Education and Research (MCAER)',
    portalLink: 'https://mcaer.org',
    tag: 'Academic'
  },
  MAFSU_ALLOTMENT: {
    id: 'MAFSU_ALLOTMENT',
    name: 'MAFSU Veterinary Allotment Letter',
    description: 'Allotment order for veterinary science and dairy technology degree seats.',
    issuingAuthority: 'Maharashtra Animal & Fishery Sciences University, Nagpur',
    tag: 'Academic'
  },
  DVET_ALLOTMENT_SLIP: {
    id: 'DVET_ALLOTMENT_SLIP',
    name: 'DVET Centralized ITI Allotment Slip',
    description: 'Government ITI Craftsman Training Scheme seat allotment letter.',
    issuingAuthority: 'Directorate of Vocational Education & Training (DVET)',
    portalLink: 'https://admission.dvet.gov.in',
    tag: 'Academic'
  },
  PRAGATI_FAMILY_AFFIDAVIT: {
    id: 'PRAGATI_FAMILY_AFFIDAVIT',
    name: 'AICTE Pragati Two-Girl Family Affidavit',
    description: 'Stamped notarized affidavit declaring that not more than two girls in the family are claiming Pragati scholarship.',
    issuingAuthority: 'Executive Magistrate / Notary Public',
    tag: 'Special'
  },
  ORPHAN_CERT: {
    id: 'ORPHAN_CERT',
    name: 'Competent Authority Orphan Certificate',
    description: 'Official orphan certificate issued by Women and Child Development Department (WCD) or death certificates of both parents.',
    issuingAuthority: 'District Women and Child Welfare Officer',
    tag: 'Special'
  },
  DEFENCE_MARTYR_CERT: {
    id: 'DEFENCE_MARTYR_CERT',
    name: 'Armed Forces Martyr / Casualty Certificate',
    description: 'Official war casualty or armed forces martyrdom certificate from Zilla Sainik Welfare Office.',
    issuingAuthority: 'Zilla Sainik Kalyan Karyalaya / Ministry of Defence',
    tag: 'Special'
  },
  SAINIK_BOARD_CERT: {
    id: 'SAINIK_BOARD_CERT',
    name: 'District Sainik Welfare Board Registration',
    description: 'Registration book or Dependent Certificate issued by the Zilla Sainik Kalyan Karyalaya.',
    issuingAuthority: 'Zilla Sainik Kalyan Karyalaya (ZSIC)',
    tag: 'Special'
  },
  BOCW_SMART_CARD: {
    id: 'BOCW_SMART_CARD',
    name: 'MahaBOCW Registered Worker Smart Card',
    description: 'Active smart card of parent registered under the Maharashtra Building & Other Construction Workers Board.',
    issuingAuthority: 'Maharashtra BOCW Welfare Board',
    portalLink: 'https://mahabocw.in',
    tag: 'Special'
  },
  '90_DAYS_WORK_CERT': {
    id: '90_DAYS_WORK_CERT',
    name: '90 Days Certified Construction Labor Certificate',
    description: 'Certificate from a registered building contractor or municipal engineer certifying at least 90 days of active construction work in the past 12 months.',
    issuingAuthority: 'Registered Construction Contractor / Labor Officer',
    tag: 'Special'
  },
  BPL_RATION_CARD: {
    id: 'BPL_RATION_CARD',
    name: 'Yellow/Orange BPL Ration Card',
    description: 'Family below poverty line ration card indicating economic disadvantage for rural bicycle assistance.',
    issuingAuthority: 'Food & Civil Supplies Department',
    tag: 'Financial'
  },
  DISTANCE_CERT: {
    id: 'DISTANCE_CERT',
    name: 'Gram Sevak 2+ KM Commute Certificate',
    description: 'Certificate from Gram Panchayat Gram Sevak confirming the girl student walks more than 2 km to school with no public bus service.',
    issuingAuthority: 'Gram Panchayat Gram Sevak / Village Sarpanch',
    tag: 'Special'
  },
  NMMS_SELECTION_CERT: {
    id: 'NMMS_SELECTION_CERT',
    name: 'NMMS Class 8 Selection Merit Certificate',
    description: 'Merit certificate from MSCE Pune verifying student qualified the National Means-cum-Merit Scholarship Examination.',
    issuingAuthority: 'Maharashtra State Council of Examination (MSCE Pune)',
    portalLink: 'https://mscepune.in',
    tag: 'Academic'
  },
  PHD_REGISTRATION_LETTER: {
    id: 'PHD_REGISTRATION_LETTER',
    name: 'Ph.D. Confirmed Registration Letter',
    description: 'Official confirmation letter from university registrar showing regular full-time Ph.D. registration and Research Advisory Committee (RAC) clearance.',
    issuingAuthority: 'University Registrar / Board of Research Studies',
    tag: 'Academic'
  },
  PURCHASE_INVOICE_BILL: {
    id: 'PURCHASE_INVOICE_BILL',
    name: 'GST Computer / Laptop Purchase Invoice',
    description: 'Original GST tax invoice indicating laptop / desktop / tablet serial number purchased with government grant funds.',
    issuingAuthority: 'Authorized Hardware Retailer / GST Registered Vendor',
    tag: 'Financial'
  }
};
