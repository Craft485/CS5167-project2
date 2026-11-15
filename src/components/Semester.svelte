<script>
  import Course from "../components/Course.svelte";
  let { courses, label } = $props();
  const totalCredits = $derived(courses.reduce((t, c) => t + c.credits, 0));
</script>

<section class="flex flex-col gap-4 p-2 rounded-2xl border-2 border-slate-600 bg-slate-900 h-min">
  <div class="relative w-full border-b-2 border-b-gray-700 text-white">
    {label}
    <span class="absolute right-0 bottom-1 font-light text-xs">
      {totalCredits} Credit(s)
    </span>
  </div>
  {#each courses as course}
    <Course courseCode={course.course_code} credits={course.credits} />
  {/each}
</section>
