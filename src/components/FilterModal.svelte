<script>
  import { CircleX } from "@lucide/svelte";
  import { untrack } from "svelte";

  let {
    initialFilters,
    onApply,
    onClose,
  } = $props();

  const startingFilters = untrack(() => initialFilters);
  let courseCode = $state(startingFilters.courseCode ?? "");
  let courseName = $state(startingFilters.courseName ?? "");
  let statuses = $state([...(startingFilters.statuses ?? [])]);
  let minCredits = $state(startingFilters.minCredits ?? "");
  let maxCredits = $state(startingFilters.maxCredits ?? "");

  const statusOptions = [
    { value: "completed", label: "Completed" },
    { value: "in_progress", label: "In progress" },
    { value: "not_started", label: "Not started" },
  ];

  function resetFilters() {
    courseCode = "";
    courseName = "";
    statuses = [];
    minCredits = "";
    maxCredits = "";
  }

  /**
   * @param {SubmitEvent} event
   */
  function applyFilters(event) {
    event.preventDefault();
    onApply({
      courseCode: courseCode.trim(),
      courseName: courseName.trim(),
      statuses: [...statuses],
      minCredits,
      maxCredits,
    });
  }
</script>

<section class="absolute z-10 inset-0 flex items-center justify-center bg-[#181818]/70 px-4 py-6 text-white">
  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby="filter-modal-title"
    class="relative w-full max-w-xl max-h-full overflow-y-auto rounded-xl border-2 border-[#1d1d1d] bg-[#2b2b2b] p-6 shadow-xl"
  >
    <button
      type="button"
      aria-label="Close filters"
      class="absolute right-3 top-3 rounded p-1 hover:bg-white/10"
      onclick={onClose}
    >
      <CircleX color="red" />
    </button>

    <h2 id="filter-modal-title" class="mb-1 pr-10 text-xl font-semibold text-white">Filter courses</h2>
    <p class="mb-5 text-sm text-slate-300">Choose one or more criteria. Selected criteria are combined.</p>

    <form class="space-y-5" onsubmit={applyFilters}>
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block text-sm font-medium text-slate-200">
          Course code
          <input
            type="search"
            bind:value={courseCode}
            placeholder="e.g. CS"
            class="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
          />
        </label>
        <label class="block text-sm font-medium text-slate-200">
          Course name
          <input
            type="search"
            bind:value={courseName}
            placeholder="Search course names"
            class="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
          />
        </label>
      </div>

      <fieldset>
        <legend class="mb-2 text-sm font-medium text-slate-200">Course status</legend>
        <div class="flex flex-wrap gap-x-5 gap-y-2">
          {#each statusOptions as status}
            <label class="inline-flex items-center gap-2 text-sm text-slate-200">
              <input
                type="checkbox"
                value={status.value}
                bind:group={statuses}
                class="size-4 accent-indigo-400"
              />
              {status.label}
            </label>
          {/each}
        </div>
        <p class="mt-1 text-xs text-slate-400">Leave all unchecked to include every status.</p>
      </fieldset>

      <fieldset>
        <legend class="mb-2 text-sm font-medium text-slate-200">Credits</legend>
        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block text-sm text-slate-300">
            Minimum credits
            <input
              type="number"
              min="0"
              step="0.5"
              bind:value={minCredits}
              placeholder="No minimum"
              class="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </label>
          <label class="block text-sm text-slate-300">
            Maximum credits
            <input
              type="number"
              min="0"
              step="0.5"
              bind:value={maxCredits}
              placeholder="No maximum"
              class="mt-1 block w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-white placeholder:text-slate-500 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/30"
            />
          </label>
        </div>
      </fieldset>

      <div class="flex justify-end gap-3 border-t border-slate-700 pt-4">
        <button
          type="button"
          class="rounded-lg px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
          onclick={resetFilters}
        >
          Reset
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-500 px-4 py-2 text-sm text-white hover:bg-white/10"
          onclick={onClose}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          Apply filters
        </button>
      </div>
    </form>
  </div>
</section>
