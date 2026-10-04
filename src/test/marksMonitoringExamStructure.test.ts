import { describe, it, expect } from 'vitest';
import { Subject, Examination } from '../types';
import { filterSubjectsForExamStructure } from '../components/MarksMonitoringView';

describe('Marks Monitoring Exam Structure Filter Tests (Tests A-G)', () => {
  // Upper Primary subjects catalogue sample
  const engSubject: Subject = { id: 's_eng', subject_code: 'ENG', subject_name: 'English', education_level: 'Grade 4–9' };
  const compSubject: Subject = { id: 's_comp', subject_code: 'COMP', subject_name: 'English Composition', education_level: 'Upper Primary' };
  const kisSubject: Subject = { id: 's_kis', subject_code: 'KIS', subject_name: 'Kiswahili', education_level: 'Grade 4–9' };
  const inshaSubject: Subject = { id: 's_insha', subject_code: 'INSHA', subject_name: 'Kiswahili Insha', education_level: 'Upper Primary' };
  const mathSubject: Subject = { id: 's_math', subject_code: 'MATH', subject_name: 'Mathematics', education_level: 'Grade 4–9' };
  const intSciSubject: Subject = { id: 's_intsci', subject_code: 'INT-SCI', subject_name: 'Integrated Science', education_level: 'Grade 4–9' };
  const casSubject: Subject = { id: 's_cas', subject_code: 'CAS', subject_name: 'Creative Arts and Sports', education_level: 'Grade 4–9' };
  const sstSubject: Subject = { id: 's_sst', subject_code: 'SST', subject_name: 'Social Studies', education_level: 'Grade 4–9' };
  const creSubject: Subject = { id: 's_cre', subject_code: 'CRE', subject_name: 'Christian Religious Education', education_level: 'PP1–Grade 9' };
  const agnSubject: Subject = { id: 's_agn', subject_code: 'AGN', subject_name: 'Agriculture', education_level: 'Grade 4–9' };
  const ssCreSubject: Subject = { id: 's_sscre', subject_code: 'SS&CRE', subject_name: 'Social Studies&CRE', education_level: 'Upper Primary' };

  const upperPrimaryCatalogue: Subject[] = [
    engSubject,
    compSubject,
    kisSubject,
    inshaSubject,
    mathSubject,
    intSciSubject,
    casSubject,
    sstSubject,
    creSubject,
    agnSubject,
    ssCreSubject,
  ];

  // Lower Primary subjects sample
  const lpSubjects: Subject[] = [
    { id: 's_lp_eng', subject_code: 'ENG', subject_name: 'English', education_level: 'Lower Primary' },
    { id: 's_lp_kis', subject_code: 'KIS', subject_name: 'Kiswahili', education_level: 'Lower Primary' },
    { id: 's_lp_math', subject_code: 'MATH', subject_name: 'Mathematics', education_level: 'Lower Primary' },
    { id: 's_lp_ila', subject_code: 'ILA', subject_name: 'Integrated Learning Area', education_level: 'Lower Primary' },
  ];

  // Junior School subjects sample
  const jsSubjects: Subject[] = [
    engSubject,
    kisSubject,
    mathSubject,
    intSciSubject,
    casSubject,
    sstSubject,
    creSubject,
    agnSubject,
    { id: 's_pretech', subject_code: 'PRE-TECH', subject_name: 'Pre-Technical Studies', education_level: 'Grade 7–9' },
  ];

  it('Test A: Grade 6 KPSEA Third Trial (ss_cre_structure = CUSTOM:25:15, include_agriculture = true)', () => {
    const exam: Examination = {
      id: 'exam_g6_third_trial',
      exam_name: 'GRADE 6 KPSEA THIRD TRIAL TERM 3 2026',
      term: 'Term 3',
      year: 2026,
      status: 'Draft',
      exam_type: 'Mid-Term',
      max_marks: 100,
      ss_cre_structure: 'CUSTOM:25:15',
      include_agriculture: true,
      education_level: 'Upper Primary',
    };

    const monitored = filterSubjectsForExamStructure(upperPrimaryCatalogue, exam);
    expect(monitored.length).toBe(10);
    expect(monitored.some((s) => s.subject_code === 'SS&CRE')).toBe(false);
    expect(monitored.some((s) => s.subject_code === 'SST')).toBe(true);
    expect(monitored.some((s) => s.subject_code === 'CRE')).toBe(true);
    expect(monitored.some((s) => s.subject_code === 'AGN')).toBe(true);
  });

  it('Test B: Direct SS&CRE examination (ss_cre_structure = null)', () => {
    const exam: Examination = {
      id: 'exam_direct_sscre',
      exam_name: 'Grade 6 Opener Assessment Term 3 2026',
      term: 'Term 3',
      year: 2026,
      status: 'Approved',
      exam_type: 'Opener',
      max_marks: 100,
      ss_cre_structure: null,
      education_level: 'Upper Primary',
    };

    const monitored = filterSubjectsForExamStructure(upperPrimaryCatalogue, exam);
    expect(monitored.some((s) => s.subject_code === 'SS&CRE')).toBe(true);
  });

  it('Test C: Agriculture excluded (include_agriculture = false)', () => {
    const exam: Examination = {
      id: 'exam_no_agn',
      exam_name: 'Grade 5 Assessment',
      term: 'Term 3',
      year: 2026,
      status: 'Open',
      exam_type: 'End-Term',
      max_marks: 100,
      ss_cre_structure: 'CUSTOM:25:15',
      include_agriculture: false,
      education_level: 'Upper Primary',
    };

    const monitored = filterSubjectsForExamStructure(upperPrimaryCatalogue, exam);
    expect(monitored.some((s) => s.subject_code === 'AGN')).toBe(false);
    expect(monitored.some((s) => s.subject_code === 'SS&CRE')).toBe(false);
    expect(monitored.length).toBe(9);
  });

  it('Test D: Agriculture included (include_agriculture = true)', () => {
    const exam: Examination = {
      id: 'exam_with_agn',
      exam_name: 'Grade 5 Assessment With AGN',
      term: 'Term 3',
      year: 2026,
      status: 'Open',
      exam_type: 'End-Term',
      max_marks: 100,
      include_agriculture: true,
      education_level: 'Upper Primary',
    };

    const monitored = filterSubjectsForExamStructure(upperPrimaryCatalogue, exam);
    expect(monitored.some((s) => s.subject_code === 'AGN')).toBe(true);
  });

  it('Test E: Legacy Agriculture configuration (include_agriculture = null / undefined)', () => {
    const examNull: Examination = {
      id: 'exam_null_agn',
      exam_name: 'Legacy Exam Null',
      term: 'Term 3',
      year: 2026,
      status: 'Open',
      exam_type: 'End-Term',
      max_marks: 100,
      include_agriculture: null,
      education_level: 'Upper Primary',
    };

    const examUndefined: Examination = {
      id: 'exam_undef_agn',
      exam_name: 'Legacy Exam Undefined',
      term: 'Term 3',
      year: 2026,
      status: 'Open',
      exam_type: 'End-Term',
      max_marks: 100,
      education_level: 'Upper Primary',
    };

    const monitoredNull = filterSubjectsForExamStructure(upperPrimaryCatalogue, examNull);
    expect(monitoredNull.some((s) => s.subject_code === 'AGN')).toBe(true);

    const monitoredUndef = filterSubjectsForExamStructure(upperPrimaryCatalogue, examUndefined);
    expect(monitoredUndef.some((s) => s.subject_code === 'AGN')).toBe(true);
  });

  it('Test F: Lower Primary monitoring regression (4 core subjects)', () => {
    const exam: Examination = {
      id: 'exam_lp_midterm',
      exam_name: 'LOWER PRIMARY MID-TERM ASSESSMENT TERM 3 2026',
      term: 'Term 3',
      year: 2026,
      status: 'Provisional',
      exam_type: 'Mid-Term',
      max_marks: 100,
      education_level: 'Lower Primary',
    };

    const monitored = filterSubjectsForExamStructure(lpSubjects, exam);
    expect(monitored.length).toBe(4);
    expect(monitored.map((s) => s.subject_code)).toEqual(['ENG', 'KIS', 'MATH', 'ILA']);
  });

  it('Test G: Junior School monitoring regression', () => {
    const exam: Examination = {
      id: 'exam_js_knec',
      exam_name: 'SBA KNEC Assessment Junior 2026',
      term: 'Term 3',
      year: 2026,
      status: 'Provisional',
      exam_type: 'Mid-Term',
      max_marks: 100,
      education_level: 'Junior School',
    };

    const monitored = filterSubjectsForExamStructure(jsSubjects, exam);
    expect(monitored.length).toBe(9);
    expect(monitored.some((s) => s.subject_code === 'SS&CRE')).toBe(false);
    expect(monitored.some((s) => s.subject_code === 'SST')).toBe(true);
    expect(monitored.some((s) => s.subject_code === 'CRE')).toBe(true);
    expect(monitored.some((s) => s.subject_code === 'PRE-TECH')).toBe(true);
  });
});
