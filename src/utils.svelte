<!-- Don't judge me for the travesty that is this file -->
<script module>
  import { courses } from "./assets/data/course.json";
  import { requirements } from "./assets/data/requirement.json";
  import { plan_requirements } from "./assets/data/plan_requirement.json";
  import { requirement_course } from "./assets/data/requirement_course.json";

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
</script>
