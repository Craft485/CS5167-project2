<script>
  import Course from "../components/Course.svelte";
  let { courses, label, showDetailsModal = $bindable() } = $props();
  const totalCredits = $derived(courses.reduce((t, c) => t + c.credits, 0));
</script>

<section class="flex flex-col gap-4 p-2 rounded-2xl border-2 border-[#1d1d1d] bg-[#1f1f1f] h-min">
  <div class="relative w-full border-b-2 border-b-gray-700 text-white">
    {label}
    <span class="absolute right-0 bottom-1 font-light text-xs">
      {totalCredits} Credit(s)
    </span>
  </div>
  {#each courses as course}
    <Course courseCode={course.course_code} credits={course.credits} bind:showDetailsModal={showDetailsModal} />
  {/each}
</section>
