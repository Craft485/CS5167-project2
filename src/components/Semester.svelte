<script>
  import Course from "../components/Course.svelte";
  import { stringToHexCode } from "../utils";

  let {
    courses,
    label,
    student,
    student_courses,
    requirement_course,
    showDetailsModal = $bindable()
  } = $props();
  const totalCredits = $derived(courses.reduce((t, c) => t + c.credits, 0));
  let semesterColor = $derived(stringToHexCode(courses.map(c => c.course_code)));

  /**
   * @param {string} courseCode
   */
  function getCourseStatus(courseCode) {
    const requirementIds = requirement_course
      .filter(entry => entry.course_code === courseCode)
      .map(entry => entry.requirement_id);

    return student_courses.find(entry =>
      entry.m_number === student.m_number && requirementIds.includes(entry.requirement_id)
    )?.status ?? "not_started";
  }
</script>

<section class="flex flex-col gap-4 p-2 rounded-2xl border-2 border-[#1d1d1d] bg-[#1f1f1f] h-min">
  <div class="relative w-full border-b-2 border-b-gray-700 text-white">
    {label}
    <span class="absolute right-0 bottom-1 font-light text-xs">
      {totalCredits} Credit(s)
    </span>
  </div>
  {#each courses as course}
    <Course
      courseCode={course.course_code}
      credits={course.credits}
      status={getCourseStatus(course.course_code)}
      displayName={course.display_name}
      bind:showDetailsModal={showDetailsModal}
      bind:color={semesterColor}
    />
  {/each}
</section>
