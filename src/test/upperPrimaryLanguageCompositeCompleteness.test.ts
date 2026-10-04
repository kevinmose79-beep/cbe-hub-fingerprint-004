import { describe, it, expect } from 'vitest';
import { Subject, Mark, Grade } from '../types';
import { getUpperPrimaryCompositeSubjectMarks } from '../utils/markUtils';
import { resolveUpperPrimaryReportStructure } from '../utils/upperPrimaryReportUtils';

describe('Upper Primary Composite English and Kiswahili Strict Component Completeness', () => {
  const engLangSub: Subject = {
    id: 'sb_up_eng',
    subject_code: 'ENG',
    subject_name: 'English Language',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const engCompSub: Subject = {
    id: 'sb_up_comp',
    subject_code: 'COMP',
    subject_name: 'English Composition',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const kiswLangSub: Subject = {
    id: 'sb_up_kis',
    subject_code: 'KIS',
    subject_name: 'Kiswahili Lugha',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const kiswInshaSub: Subject = {
    id: 'sb_up_insha',
    subject_code: 'INSHA',
    subject_name: 'Kiswahili Insha',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const mathSub: Subject = {
    id: 'sb_up_math',
    subject_code: 'MATH',
    subject_name: 'Mathematics',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const sciSub: Subject = {
    id: 'sb_up_sci',
    subject_code: 'INT-SCI',
    subject_name: 'Integrated Science',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const casSub: Subject = {
    id: 'sb_up_cas',
    subject_code: 'CAS',
    subject_name: 'Creative Arts and Sports',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const ssCreSub: Subject = {
    id: 'sb_up_ss_cre',
    subject_code: 'SS&CRE',
    subject_name: 'Social Studies & CRE',
    education_level: 'Upper Primary',
    category: 'Core',
    applicable_grades: ['Grade 4', 'Grade 5', 'Grade 6'],
  };

  const allSubjects = [engLangSub, engCompSub, kiswLangSub, kiswInshaSub, mathSub, sciSub, casSub, ssCreSub];

  const grades: Grade[] = [
    { id: 'g1', grade_code: 'EE', grade: 'EE', performance_level: 'EE', points: 4, min_percentage: 80, max_percentage: 100, remarks: 'Exceeding' },
    { id: 'g2', grade_code: 'ME', grade: 'ME', performance_level: 'ME', points: 3, min_percentage: 50, max_percentage: 79, remarks: 'Meeting' },
    { id: 'g3', grade_code: 'AE', grade: 'AE', performance_level: 'AE', points: 2, min_percentage: 35, max_percentage: 49, remarks: 'Approaching' },
    { id: 'g4', grade_code: 'BE', grade: 'BE', performance_level: 'BE', points: 1, min_percentage: 0, max_percentage: 34, remarks: 'Below' },
  ];

  describe('1. English Composite Cases (getUpperPrimaryCompositeSubjectMarks)', () => {
    it('Case A: ENG 50 + COMP 40 -> 90/100 Normal', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: engLangSub.id, marks: 50, raw_score: 50, out_of: 60 },
        { id: 'm2', student_id: 'std_1', exam_id: 'ex_1', subject_id: engCompSub.id, marks: 40, raw_score: 40, out_of: 40 },
      ];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthEng = processedMarks.find((m) => m.subject_id === 'synth_english_composite');
      expect(synthEng).toBeDefined();
      expect(synthEng?.score).toBe(90);
      expect(synthEng?.raw_score).toBe(90);
      expect(synthEng?.special_status).toBe('Normal');
    });

    it('Case B: ENG 50 + COMP blank -> X/Incomplete', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: engLangSub.id, marks: 50, raw_score: 50, out_of: 60 },
      ];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthEng = processedMarks.find((m) => m.subject_id === 'synth_english_composite');
      expect(synthEng).toBeDefined();
      expect(synthEng?.score).toBe(null);
      expect(synthEng?.raw_score).toBe(null);
      expect(synthEng?.special_status).toBe('X');
    });

    it('Case C: ENG blank + COMP 40 -> X/Incomplete', () => {
      const marks: Mark[] = [
        { id: 'm2', student_id: 'std_1', exam_id: 'ex_1', subject_id: engCompSub.id, marks: 40, raw_score: 40, out_of: 40 },
      ];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthEng = processedMarks.find((m) => m.subject_id === 'synth_english_composite');
      expect(synthEng).toBeDefined();
      expect(synthEng?.score).toBe(null);
      expect(synthEng?.raw_score).toBe(null);
      expect(synthEng?.special_status).toBe('X');
    });

    it('Case D: ENG blank + COMP blank -> no synthetic mark (unassessed)', () => {
      const marks: Mark[] = [];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthEng = processedMarks.find((m) => m.subject_id === 'synth_english_composite');
      expect(synthEng).toBeUndefined();
    });
  });

  describe('2. Kiswahili Composite Cases (getUpperPrimaryCompositeSubjectMarks)', () => {
    it('Case A: KIS 60 + INSHA 30 -> 90/100 Normal', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: kiswLangSub.id, marks: 60, raw_score: 60, out_of: 60 },
        { id: 'm2', student_id: 'std_1', exam_id: 'ex_1', subject_id: kiswInshaSub.id, marks: 30, raw_score: 30, out_of: 40 },
      ];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthKisw = processedMarks.find((m) => m.subject_id === 'synth_kiswahili_composite');
      expect(synthKisw).toBeDefined();
      expect(synthKisw?.score).toBe(90);
      expect(synthKisw?.raw_score).toBe(90);
      expect(synthKisw?.special_status).toBe('Normal');
    });

    it('Case B: KIS 60 + INSHA blank -> X/Incomplete', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: kiswLangSub.id, marks: 60, raw_score: 60, out_of: 60 },
      ];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthKisw = processedMarks.find((m) => m.subject_id === 'synth_kiswahili_composite');
      expect(synthKisw).toBeDefined();
      expect(synthKisw?.score).toBe(null);
      expect(synthKisw?.raw_score).toBe(null);
      expect(synthKisw?.special_status).toBe('X');
    });

    it('Case C: KIS blank + INSHA 30 -> X/Incomplete', () => {
      const marks: Mark[] = [
        { id: 'm2', student_id: 'std_1', exam_id: 'ex_1', subject_id: kiswInshaSub.id, marks: 30, raw_score: 30, out_of: 40 },
      ];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthKisw = processedMarks.find((m) => m.subject_id === 'synth_kiswahili_composite');
      expect(synthKisw).toBeDefined();
      expect(synthKisw?.score).toBe(null);
      expect(synthKisw?.raw_score).toBe(null);
      expect(synthKisw?.special_status).toBe('X');
    });

    it('Case D: KIS blank + INSHA blank -> no synthetic mark (unassessed)', () => {
      const marks: Mark[] = [];
      const { processedMarks } = getUpperPrimaryCompositeSubjectMarks(marks, allSubjects, 'Upper Primary');
      const synthKisw = processedMarks.find((m) => m.subject_id === 'synth_kiswahili_composite');
      expect(synthKisw).toBeUndefined();
    });
  });

  describe('3. Report Card Structure (resolveUpperPrimaryReportStructure)', () => {
    const student = { id: 'std_1', admission_number: 'ADM01', full_name: 'Test Learner', grade: 'Grade 6' };
    const classObj = { id: 'cls_1', class_name: 'Grade 6 East', education_level: 'Upper Primary' };

    it('English: ENG 50 + COMP 40 -> Consolidated 90/100 Normal', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: engLangSub.id, marks: 50, raw_score: 50, out_of: 60 },
        { id: 'm2', student_id: 'std_1', exam_id: 'ex_1', subject_id: engCompSub.id, marks: 40, raw_score: 40, out_of: 40 },
      ];
      const report = resolveUpperPrimaryReportStructure({
        student: student as any,
        targetClass: classObj as any,
        examId: 'ex_1',
        allStudents: [student as any],
        classes: [classObj as any],
        marks,
        subjects: allSubjects,
        grades,
      });

      expect(report.english.status).toBe('Normal');
      expect(report.english.rawScore).toBe(90);
      expect(report.english.displayScore).toBe('90/100');
      expect(report.english.percentage).toBe(90);
    });

    it('English: ENG 50 + COMP blank -> Consolidated X (Missing Assessment)', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: engLangSub.id, marks: 50, raw_score: 50, out_of: 60 },
      ];
      const report = resolveUpperPrimaryReportStructure({
        student: student as any,
        targetClass: classObj as any,
        examId: 'ex_1',
        allStudents: [student as any],
        classes: [classObj as any],
        marks,
        subjects: allSubjects,
        grades,
      });

      expect(report.english.status).toBe('X');
      expect(report.english.rawScore).toBe(null);
      expect(report.english.displayScore).toBe('X');
      expect(report.isComplete).toBe(false);
    });

    it('Kiswahili: KIS 60 + INSHA 30 -> Consolidated 90/100 Normal', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: kiswLangSub.id, marks: 60, raw_score: 60, out_of: 60 },
        { id: 'm2', student_id: 'std_1', exam_id: 'ex_1', subject_id: kiswInshaSub.id, marks: 30, raw_score: 30, out_of: 40 },
      ];
      const report = resolveUpperPrimaryReportStructure({
        student: student as any,
        targetClass: classObj as any,
        examId: 'ex_1',
        allStudents: [student as any],
        classes: [classObj as any],
        marks,
        subjects: allSubjects,
        grades,
      });

      expect(report.kiswahili.status).toBe('Normal');
      expect(report.kiswahili.rawScore).toBe(90);
      expect(report.kiswahili.displayScore).toBe('90/100');
      expect(report.kiswahili.percentage).toBe(90);
    });

    it('Kiswahili: KIS 60 + INSHA blank -> Consolidated X (Missing Assessment)', () => {
      const marks: Mark[] = [
        { id: 'm1', student_id: 'std_1', exam_id: 'ex_1', subject_id: kiswLangSub.id, marks: 60, raw_score: 60, out_of: 60 },
      ];
      const report = resolveUpperPrimaryReportStructure({
        student: student as any,
        targetClass: classObj as any,
        examId: 'ex_1',
        allStudents: [student as any],
        classes: [classObj as any],
        marks,
        subjects: allSubjects,
        grades,
      });

      expect(report.kiswahili.status).toBe('X');
      expect(report.kiswahili.rawScore).toBe(null);
      expect(report.kiswahili.displayScore).toBe('X');
      expect(report.isComplete).toBe(false);
    });
  });
});
