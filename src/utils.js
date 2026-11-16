// Don't judge me for the travesty that is this file
import { courses } from "./assets/data/course.json";
import { requirements } from "./assets/data/requirement.json";
import { plan_requirements } from "./assets/data/plan_requirement.json";
import { requirement_course } from "./assets/data/requirement_course.json";
import {students} from './assets/data/student.json';
import {student_courses} from './assets/data/student_courses.json';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * @param plan_code {string}
 * @returns {typeof courses[]}
 */
export function fetchCoursesForPlan(plan_code) {
  const planReqMap = plan_requirements.filter(connection => connection.plan_code === plan_code);
  const reqCourseMap = planReqMap.map(({ requirement_id }) => requirement_course.find(entry => entry.requirement_id === requirement_id) ?? { course_code: "", requirement_id });
  const reqs = requirements.filter(r => reqCourseMap.some(v => v.requirement_id === r.requirement_id));
  /** @type {(typeof courses[number])[][]} */
  const result = [];
  const semesters = reqs.reduce((groups, req) => {
    const courseCode = reqCourseMap.find(rc => rc.requirement_id === req.requirement_id)?.course_code;
    const course = courses.find(c => c.course_code === courseCode);
    (groups[req.semester - 1] ??= []).push(course ?? {
      // TODO: Update this placeholder
      course_code: req.requirement_id,
      course_name: req.requirement_id,
      credits: 3,
      description: "",
      prerequisites: [],
    });
    return groups;
  }, result);

  return semesters;
}

// Utility method adapted from https://stackoverflow.com/questions/3426404/create-a-hexadecimal-colour-based-on-a-string-with-javascript
/**
 * Get a hex color for some string
 * @param {string} str An arbitrary string
 * @returns {string} A 6 character hexcode
 */
export function stringToHexCode(str) {
  let hash = 0;
  for (const char of str) {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }
  return color;
}

/**
 * Usage: getPDFData(courses, student_courses, students, "12345678")
 * 
 * @param {typeof courses} courses 
 * @param {typeof student_courses} student_courses 
 * @param {typeof students} students 
 * @param {string} student_m_number 
 */
export function getPDFData(courses, student_courses, students, student_m_number) {
  const student_info = students.find(s => s.m_number === student_m_number);

  // Catalog lookup: course_code -> course info
  const course_lookup = new Map(courses.map(c => [c.course_code, c]));

  // Attach course info to each of the student's records
  const student_record = student_courses
    .filter(r => r.m_number === student_m_number)
    .map(r => ({
      ...r,
      ...(course_lookup.get(r.requirement_id) ?? {}),
    }));

  const completedCourses   = student_record.filter(c => c.status === "completed");
  const currentCourses     = student_record.filter(c => c.status === "in_progress");
  const outstandingCourses = student_record.filter(c => c.status === "not_started");

  createPDF(completedCourses, currentCourses, outstandingCourses, student_info);
}

/**
 * Util for getPDFData
 * 
 * @param {*} completedCourses 
 * @param {*} currentCourses 
 * @param {*} outstandingCourses 
 * @param {*} student_info 
 */
function createPDF(completedCourses, currentCourses, outstandingCourses, student_info) {

  const today = new Date().toLocaleDateString("en-US", {
  month: "2-digit",
  day: "2-digit",
  year: "numeric",
  });

  const FONT = "helvetica";
  const BASE_SIZE = 10;

  const doc = new jsPDF();

  doc.setFont(FONT, "bold");
  doc.setFontSize(BASE_SIZE);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const centerX = pageWidth / 2;
  const leftMargin = 5;
  const middleMargin = 35;

  doc.text(
    ["Academic Advisement Report", `For ${student_info.name} prepared on ${today}`],
    centerX,
    10,
    { align: "center" }
  );  
  const completedCredits = completedCourses.reduce(
  (sum, c) => sum + (Number(c.credits) || 0), 0
  );

  const minRequiredCredits = outstandingCourses.reduce(
    (sum, c) => sum + (Number(c.credits) || 0), 0
  ) + currentCourses.reduce((sum, c) => sum + (Number(c.credits) || 0), 0) + completedCredits;  // fill in from your plan data

  autoTable(doc, {
    startY: 25,
    margin: { left: middleMargin, right: middleMargin },
    theme: "plain",
    styles: { font: FONT, fontSize: BASE_SIZE, cellPadding: 1 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 20 },
      1: { cellWidth: 45 },
      2: { fontStyle: "bold", cellWidth: 65 },
      3: { cellWidth: "auto" },
    },
    body: [
      ["UCID:", String(student_info.m_number ?? ""), "Completed Credit Hours:", String(completedCredits)],
      ["GPA:",  String(student_info.gpa ?? ""),      "Minimum Required Credit Hours:", String(minRequiredCredits)],
    ],
  });

  let y = doc.lastAutoTable.finalY + 10;

  // Shared cell getters
  const id      = c => c.requirement_id;
  const name = c => {
  if (c.course_name) return c.course_name;
  const rid = c.requirement_id ?? "";
  if (rid.includes("CS_ELECTIVES")) return "CS ELECTIVE";
  if (rid.includes("SCI_ELECTIVE")) return "SCIENCE ELECTIVE";
  if (rid.includes("GENERAL_EDUCATION")) return "GENERAL EDUCATION";
  return "GENERAL ELECTIVE";
  };
  const credits = c => c.credits || "N/A";
  const grade   = c => c.grade ?? "";
  const term    = c => c.term ?? "";

  const sections = [
    {
      title: "Current Courses",
      courses: currentCourses,
      columns: [
        { header: "Course ID",   get: id },
        { header: "Course Name", get: name },
        { header: "Credits",       get: credits },
        { header: "Term",        get: term}
      ],
    },
    {
      title: "Outstanding Courses",
      courses: outstandingCourses,
      columns: [
        { header: "Course ID",   get: id },
        { header: "Course Name", get: name },
        { header: "Credits",     get: credits },
        { header: "Estimated Term", get: term}
      ],
    },
    {
      title: "Completed Courses",
      courses: completedCourses,
      columns: [
        { header: "Course ID",   get: id },
        { header: "Course Name", get: name },
        { header: "Credits",     get: credits },
        { header: "Grade",       get: grade },
        { header: "Term Taken",  get: term },
      ],
    },
  ];

  sections.forEach(({ title, courses, columns }) => {
    if (y > pageHeight - 40) {
      doc.addPage();
      y = 15;
    }

    doc.setFontSize(14);
    doc.text(title, leftMargin, y);

    autoTable(doc, {
      startY: y + 3,
      margin: { left: leftMargin, right: leftMargin },
      head: [columns.map(col => col.header)],
      body: courses.length
        ? courses.map(c => columns.map(col => col.get(c)))
        : [[{ content: "None", colSpan: columns.length, styles: { halign: "center" } }]],
      styles: { fontSize: 10 },
      headStyles: { fillColor: [60, 60, 60] },
      columnStyles: { 0: { cellWidth: 25, overflow: 'ellipsize' } }
    });

    y = doc.lastAutoTable.finalY + 12;
  });

  doc.save(`Academic Advisement Report - ${student_info.name}.pdf`);
}
