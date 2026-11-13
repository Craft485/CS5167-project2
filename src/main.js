import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'

import {courses} from './assets/data/course.json'
import {students} from './assets/data/student.json'
import {plan_requirements} from './assets/data/plan_requirement.json' 
import {student_courses} from './assets/data/student_courses.json'

const app = mount(App, {
  target: document.getElementById('app'),
})

export default app


import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";


function getPDFData(courses, student_courses, students, student_m_number) {
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
  const name    = c => c.course_name ?? "";
  const credits = c => c.credits ?? "";
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

getPDFData(courses, student_courses, students, "12345678");
