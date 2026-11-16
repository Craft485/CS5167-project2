<script>
  /**
   * @type {{
      requirement: typeof import("../assets/data/requirement.json")["requirements"][number]
      courses: typeof import("../assets/data/course.json")["courses"][number][]
    }}
   */
  let { requirement, courses } = $props();

  const isElective = $derived(
    requirement.requirement_id.toUpperCase().includes("ELECTIVE") || courses.length > 1
  );
</script>

<section class="flex h-full w-full flex-col gap-4 overflow-hidden text-white mt-4 mb-4">
  <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2">
    {#if isElective}
      <header class="shrink-0">
        <p class="text-xs font-semibold uppercase tracking-widest text-sky-300">Elective requirement</p>
        <h2 class="mt-1 text-xl font-semibold">{requirement.display_name ?? requirement.requirement_id}</h2>
        <p class="mt-1 text-sm text-gray-300">
          {courses.length} course{courses.length === 1 ? "" : "s"} can satisfy this requirement.
        </p>
      </header>

      {#if courses.length > 0}
        <ul class="flex flex-col gap-3">
          {#each courses as course (course.course_code)}
            <li class="rounded-lg border border-white/10 bg-black/15 p-3">
              <div class="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h3 class="font-semibold">{course.course_name}</h3>
                <span class="text-sm text-sky-200">{course.course_code}</span>
              </div>
              <p class="mt-1 text-sm text-gray-300">{course.credits} {course.credits === 1 ? "credit" : "credits"}</p>
              {#if course.description}
                <p class="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-200">{course.description}</p>
              {/if}
              {#if course.prerequisites?.length}
                <p class="mt-2 text-sm text-gray-300">
                  <span class="font-medium text-white">Prerequisites:</span>
                  {course.prerequisites.join(", ")}
                </p>
              {:else}
                <p class="mt-2 text-sm text-gray-400">No listed prerequisites</p>
              {/if}
            </li>
          {/each}
        </ul>
      {:else}
        <p class="rounded-lg border border-white/10 p-3 text-sm text-gray-300">No eligible courses are listed for this requirement.</p>
      {/if}
    {:else if courses.length > 0}
      {@const course = courses[0]}
      <header class="shrink-0">
        <p class="text-xs font-semibold uppercase tracking-widest text-sky-300">Course details</p>
        <h2 class="mt-1 text-xl font-semibold">{course.course_name}</h2>
      </header>

      <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 rounded-lg border border-white/10 bg-black/15 p-3 text-sm">
        <dt class="font-medium text-gray-400">Course code</dt>
        <dd>{course.course_code}</dd>
        <dt class="font-medium text-gray-400">Credits</dt>
        <dd>{course.credits} {course.credits === 1 ? "credit" : "credits"}</dd>
      </dl>

      <section>
        <h3 class="text-sm font-semibold text-gray-300">Description</h3>
        <p class="mt-1 whitespace-pre-line text-sm leading-relaxed text-gray-100">
          {course.description || "No description available."}
        </p>
      </section>

      <section>
        <h3 class="text-sm font-semibold text-gray-300">Prerequisites</h3>
        {#if course.prerequisites?.length}
          <ul class="mt-1 flex flex-wrap gap-2">
            {#each course.prerequisites as prerequisite}
              <li class="rounded-full bg-white/10 px-3 py-1 text-sm">{prerequisite}</li>
            {/each}
          </ul>
        {:else}
          <p class="mt-1 text-sm text-gray-400">No listed prerequisites</p>
        {/if}
      </section>
    {:else}
      <p class="text-sm text-gray-300">No course details are available for this requirement.</p>
    {/if}
  </div>
</section>
