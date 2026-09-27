import { Scheme, StudentProfile, StrictMatchEvaluation, CriteriaCheck } from '../types';

/**
 * Normalizes education levels into broad categories for consistent comparison
 */
function normalizeEducationLevel(levelStr: string): string[] {
  const s = (levelStr || '').toLowerCase();
  const matched: string[] = [];

  if (s.includes('9') || s.includes('10') || s.includes('secondary') || s.includes('school') || s.includes('ssc')) {
    matched.push('secondary');
  }
  if (s.includes('11') || s.includes('12') || s.includes('junior college') || s.includes('higher secondary') || s.includes('hsc')) {
    matched.push('junior_college');
  }
  if (s.includes('iti') || s.includes('craftsman')) {
    matched.push('iti');
  }
  if (s.includes('diploma') || s.includes('polytechnic')) {
    matched.push('diploma');
  }
  if (s.includes('undergrad') || s.includes('bachelor') || s.includes('degree') || s.includes('b.sc') || s.includes('b.tech') || s.includes('be') || s.includes('mbbs') || s.includes('ug')) {
    matched.push('undergraduate');
  }
  if (s.includes('postgrad') || s.includes('master') || s.includes('m.sc') || s.includes('m.tech') || s.includes('pg') || s.includes('mba') || s.includes('mcom') || s.includes('ma')) {
    matched.push('postgraduate');
  }
  if (s.includes('phd') || s.includes('m.phil') || s.includes('research') || s.includes('post-doc') || s.includes('doctorate')) {
    matched.push('phd');
  }

  return matched;
}

/**
 * Evaluates strict eligibility for a single scheme against a student's profile.
 * Every qualification parameter must be strictly satisfied.
 */
export function evaluateStrictEligibility(profile: StudentProfile, scheme: Scheme): StrictMatchEvaluation {
  const failureReasons: string[] = [];

  // 1. Domicile Check
  const domicilePassed = profile.isMaharashtraDomicile === true;
  if (!domicilePassed) {
    failureReasons.push('Maharashtra domicile certificate is mandatory for state government benefits');
  }
  const domicileCheck: CriteriaCheck = {
    passed: domicilePassed,
    label: 'Maharashtra Domicile',
    userValue: profile.isMaharashtraDomicile ? 'Maharashtra Domicile' : 'Non-Maharashtra',
    requiredValue: 'Mandatory Maharashtra Domicile'
  };

  // 2. Category / Target Audience Check
  let categoryPassed = false;
  const targetLower = (scheme.target_audience || '').toLowerCase();
  const studentCat = (profile.category || '').toUpperCase();

  if (
    targetLower.includes('all categories') ||
    targetLower.includes('general meritorious') ||
    targetLower.includes('educated youth') ||
    targetLower.includes('students in civic-run') ||
    targetLower.includes('top 20th percentile') ||
    targetLower.includes('top 1%') ||
    targetLower.includes('alumni of state government')
  ) {
    categoryPassed = true;
  } else if (targetLower.includes('open') || targetLower.includes('ews')) {
    categoryPassed = ['OPEN', 'EWS', 'SEBC'].includes(studentCat);
  } else if (targetLower.includes('scheduled caste') || targetLower.includes('(sc)')) {
    categoryPassed = studentCat === 'SC';
  } else if (targetLower.includes('scheduled tribe') || targetLower.includes('(st)')) {
    categoryPassed = studentCat === 'ST';
  } else if (targetLower.includes('vjnt') || targetLower.includes('vimukta')) {
    categoryPassed = studentCat === 'VJNT';
  } else if (targetLower.includes('other backward classes') || targetLower.includes('(obc)')) {
    categoryPassed = studentCat === 'OBC';
  } else if (targetLower.includes('special backward class') || targetLower.includes('(sbc)')) {
    categoryPassed = studentCat === 'SBC';
  } else if (targetLower.includes('minority') || targetLower.includes('muslim') || targetLower.includes('christian')) {
    categoryPassed = studentCat === 'MINORITY';
  } else if (targetLower.includes('maratha') || targetLower.includes('sebc')) {
    categoryPassed = ['SEBC', 'OPEN', 'EWS'].includes(studentCat);
  } else if (targetLower.includes('differently-abled') || targetLower.includes('pwd') || targetLower.includes('disabled')) {
    categoryPassed = profile.hasDisability === true;
  } else {
    // Exact or token match
    categoryPassed = targetLower.includes(studentCat.toLowerCase());
  }

  if (!categoryPassed) {
    failureReasons.push(`Category mismatch: Scheme targets ${scheme.target_audience}, but student is ${profile.category}`);
  }
  const categoryCheck: CriteriaCheck = {
    passed: categoryPassed,
    label: 'Caste / Social Category',
    userValue: profile.category,
    requiredValue: scheme.target_audience
  };

  // 3. Annual Family Income Check
  let incomePassed = true;
  let incomeNote = 'Within allowed ceiling';

  // Special case: Freeship schemes for SC / ST require income > 2,50,000 (no upper ceiling)
  if (scheme.title.includes('Freeship') && (scheme.target_audience.includes('SC') || scheme.target_audience.includes('ST'))) {
    if (profile.annualFamilyIncome <= 250000) {
      incomePassed = false;
      incomeNote = 'Freeship requires annual income above ₹2,50,000 (students ≤ ₹2.5L should apply for Post-Matric Scholarship)';
      failureReasons.push(incomeNote);
    }
  } else if (scheme.income_limit !== null && scheme.income_limit > 0) {
    if (profile.annualFamilyIncome > scheme.income_limit) {
      incomePassed = false;
      incomeNote = `Family income ₹${profile.annualFamilyIncome.toLocaleString('en-IN')} exceeds limit of ₹${scheme.income_limit.toLocaleString('en-IN')}`;
      failureReasons.push(incomeNote);
    }
  }

  const incomeCheck: CriteriaCheck = {
    passed: incomePassed,
    label: 'Annual Family Income',
    userValue: `₹${profile.annualFamilyIncome.toLocaleString('en-IN')} / Year`,
    requiredValue: scheme.income_limit_text,
    note: incomeNote
  };

  // 4. Education Level Check
  const studentLevels = normalizeEducationLevel(profile.educationLevel + ' ' + (profile.standardYear || ''));
  const schemeLevels = normalizeEducationLevel(scheme.level);

  let educationLevelPassed = false;
  if (schemeLevels.length === 0) {
    educationLevelPassed = true;
  } else {
    // Check if any normalized level overlaps
    educationLevelPassed = studentLevels.some((lvl) => schemeLevels.includes(lvl));
  }

  if (!educationLevelPassed) {
    failureReasons.push(`Education level mismatch: Scheme is for ${scheme.level}, but student is in ${profile.educationLevel}`);
  }
  const educationLevelCheck: CriteriaCheck = {
    passed: educationLevelPassed,
    label: 'Education Level',
    userValue: `${profile.educationLevel} (${profile.standardYear || ''})`,
    requiredValue: scheme.level
  };

  // 5. Stream Restriction Check
  let streamPassed = true;
  if (scheme.stream_restriction && scheme.stream_restriction !== 'all') {
    const streamRequired = scheme.stream_restriction.toLowerCase();
    const studentStream = (profile.stream || '').toLowerCase();

    if (streamRequired === 'science') {
      streamPassed = ['science', 'engineering', 'medical', 'agriculture', 'veterinary'].includes(studentStream);
    } else if (streamRequired === 'engineering') {
      streamPassed = ['engineering', 'science'].includes(studentStream);
    } else if (streamRequired === 'medical') {
      streamPassed = studentStream === 'medical';
    } else if (streamRequired === 'fine arts') {
      streamPassed = ['fine arts', 'arts'].includes(studentStream);
    } else if (streamRequired === 'agriculture') {
      streamPassed = ['agriculture', 'science'].includes(studentStream);
    } else if (streamRequired === 'veterinary') {
      streamPassed = ['veterinary', 'medical', 'science'].includes(studentStream);
    } else if (streamRequired === 'iti') {
      streamPassed = studentLevels.includes('iti');
    } else {
      streamPassed = studentStream.includes(streamRequired);
    }

    if (!streamPassed) {
      failureReasons.push(`Stream mismatch: Scheme requires ${scheme.stream_restriction}, but student is in ${profile.stream}`);
    }
  }
  const streamCheck: CriteriaCheck = {
    passed: streamPassed,
    label: 'Academic Stream',
    userValue: profile.stream,
    requiredValue: scheme.stream_restriction && scheme.stream_restriction !== 'all' ? scheme.stream_restriction : 'Any Stream'
  };

  // 6. Academic Cutoff / Marks Percentage Check
  let academicPassed = true;
  if (scheme.min_academic_percentage > 0) {
    if (profile.percentage < scheme.min_academic_percentage) {
      academicPassed = false;
      failureReasons.push(`Marks cutoff: Requires ≥ ${scheme.min_academic_percentage}%, but student scored ${profile.percentage}%`);
    }
  }
  const academicCheck: CriteriaCheck = {
    passed: academicPassed,
    label: 'Qualifying Examination Score',
    userValue: `${profile.percentage}%`,
    requiredValue: scheme.min_academic_percentage > 0 ? `≥ ${scheme.min_academic_percentage}%` : 'Passing Marks'
  };

  // 7. Special Status - Hostel Residence
  let hostelPassed = true;
  if (scheme.requires_hostel && !profile.hostelResident) {
    hostelPassed = false;
    failureReasons.push('Hostel / Rental proof required: Scheme is strictly for hostellers residing outside native town');
  }
  const hostelCheck: CriteriaCheck = {
    passed: hostelPassed,
    label: 'Hostel / Rental Status',
    userValue: profile.hostelResident ? 'Hosteller / Off-Campus Rental' : 'Day Scholar',
    requiredValue: scheme.requires_hostel ? 'Mandatory Hosteller' : 'Day Scholar or Hosteller'
  };

  // 8. Special Status - Marginal Farmer (7/12 Land Extract)
  let marginalFarmerPassed = true;
  if (scheme.requires_marginal_farmer && !profile.marginalFarmerChild) {
    marginalFarmerPassed = false;
    failureReasons.push('Marginal Farmer Child certificate (7/12 Land Extract) required for this grant');
  }
  const marginalFarmerCheck: CriteriaCheck = {
    passed: marginalFarmerPassed,
    label: 'Parent Agriculturist (7/12)',
    userValue: profile.marginalFarmerChild ? 'Holds 7/12 Land Extract' : 'Not Marginal Farmer',
    requiredValue: scheme.requires_marginal_farmer ? 'Registered Marginal Farmer Child' : 'Not Required'
  };

  // 9. Disability Check (UDID)
  let disabilityPassed = true;
  if (scheme.requires_disability) {
    if (!profile.hasDisability || (profile.disabilityPercentage !== undefined && profile.disabilityPercentage < 40)) {
      disabilityPassed = false;
      failureReasons.push('Benchmark disability (UDID card ≥ 40%) required for this assistive scheme');
    }
  }
  const disabilityCheck: CriteriaCheck = {
    passed: disabilityPassed,
    label: 'Disability / Assistive Status',
    userValue: profile.hasDisability ? `Benchmark Disability (${profile.disabilityPercentage || 40}%)` : 'Not Applicable',
    requiredValue: scheme.requires_disability ? 'UDID Card (≥ 40%)' : 'Open to All'
  };

  // 10. Gender Restriction
  let genderPassed = true;
  if (scheme.gender_restriction && scheme.gender_restriction !== 'all') {
    if (profile.gender !== scheme.gender_restriction) {
      genderPassed = false;
      failureReasons.push(`Gender restriction: Scheme exclusively benefits ${scheme.gender_restriction} students`);
    }
  }
  const genderCheck: CriteriaCheck = {
    passed: genderPassed,
    label: 'Gender Eligibility',
    userValue: profile.gender,
    requiredValue: scheme.gender_restriction === 'female' ? 'Female Only' : scheme.gender_restriction === 'male' ? 'Male Only' : 'All Genders'
  };

  // 11. CAP Round Admission
  let capPassed = true;
  if (scheme.requires_cap_allotment && profile.capAllotmentAdmitted === false) {
    capPassed = false;
    failureReasons.push('Admission must be via Centralized Admission Process (CAP Round Quota)');
  }
  const capCheck: CriteriaCheck = {
    passed: capPassed,
    label: 'CAP Centralized Admission',
    userValue: profile.capAllotmentAdmitted ? 'Admitted via CAP Round' : 'Management / Non-CAP',
    requiredValue: scheme.requires_cap_allotment ? 'Mandatory CAP Allotment' : 'Any Valid Admission'
  };

  // Final Strict Check: All criteria must be true
  const isEligible =
    domicilePassed &&
    categoryPassed &&
    incomePassed &&
    educationLevelPassed &&
    streamPassed &&
    academicPassed &&
    hostelPassed &&
    marginalFarmerPassed &&
    disabilityPassed &&
    genderPassed &&
    capPassed;

  return {
    scheme,
    isEligible,
    criteriaChecks: {
      category: categoryCheck,
      income: incomeCheck,
      educationLevel: educationLevelCheck,
      stream: streamCheck,
      academicPercentage: academicCheck,
      hostel: hostelCheck,
      marginalFarmer: marginalFarmerCheck,
      disability: disabilityCheck,
      gender: genderCheck,
      domicile: domicileCheck,
      capAdmission: capCheck
    },
    failureReasons
  };
}

/**
 * Filters the entire schemes database so that a student is ONLY shown
 * schemes for which they strictly meet ALL criteria.
 */
export function matchStudentWithSchemes(
  profile: StudentProfile,
  allSchemes: Scheme[]
): StrictMatchEvaluation[] {
  const results: StrictMatchEvaluation[] = [];

  for (const scheme of allSchemes) {
    const evaluation = evaluateStrictEligibility(profile, scheme);
    // STRICT RULE: If a student does not strictly satisfy every qualification parameter,
    // the scheme is filtered out.
    if (evaluation.isEligible) {
      results.push(evaluation);
    }
  }

  // Sort by earliest upcoming deadline first
  results.sort((a, b) => new Date(a.scheme.deadline).getTime() - new Date(b.scheme.deadline).getTime());

  return results;
}
