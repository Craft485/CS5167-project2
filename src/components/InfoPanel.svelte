<script>
  import { CircleCheck, CircleDashed, CircleX, Clock3 } from "@lucide/svelte";
  import { onMount } from "svelte";

  /** @type {{ onclose: () => void }} */
  let { onclose } = $props();

  /** @type {HTMLDialogElement} */
  let dialog;

  onMount(() => {
    dialog.showModal();
  });
</script>

<dialog
  bind:this={dialog}
  {onclose}
  aria-labelledby="audit-info-title"
  class="fixed inset-0 m-auto max-h-[80dvh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden rounded-xl border-4 border-[#1d1d1d] bg-[#2b2b2b] text-white open:flex backdrop:bg-[#181818]/50"
>
  <header class="relative shrink-0 px-4 pt-4 pb-3 sm:px-6 sm:pt-6">
    <h2 id="audit-info-title" class="m-0! pr-9 text-xl! font-semibold! text-white!">About the degree audit</h2>
    <button
      type="button"
      aria-label="Close audit info"
      onclick={() => dialog.close()}
      class="absolute top-2 right-2 grid size-9 place-items-center rounded-lg text-red-400 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-sky-300"
    >
      <CircleX size={22} aria-hidden="true" />
    </button>
  </header>

  <div class="min-h-0 overflow-y-auto px-4 pb-4 sm:px-6 sm:pb-6">
    <p class="mb-4! text-sm leading-relaxed text-gray-300">
      See your degree requirements and the recommended semester for each course.
    </p>

    <div class="grid gap-3 sm:grid-cols-[3fr_2fr]">
      <section class="rounded-lg border border-white/10 bg-black/15 p-3">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-sky-300">Reading the plan</h3>
        <ul class="mt-2 list-disc space-y-1.5 pl-4 text-sm leading-relaxed text-gray-200">
          <li>Use the plan menu to switch degree programs.</li>
          <li>Scroll sideways to view later semesters.</li>
          <li>Course cards show credit hours. <strong>Total Credits</strong> adds up the credits shown across the selected plan.</li>
        </ul>
      </section>

      <section class="rounded-lg border border-white/10 bg-black/15 p-3">
        <h3 class="text-xs font-semibold uppercase tracking-widest text-sky-300">Course status</h3>
        <ul class="mt-2 flex flex-col gap-2 text-sm text-gray-200">
          <li class="flex items-center gap-2">
            <CircleCheck size={16} class="text-emerald-400" aria-hidden="true" />
            Completed
          </li>
          <li class="flex items-center gap-2">
            <Clock3 size={16} class="text-amber-300" aria-hidden="true" />
            In progress
          </li>
          <li class="flex items-center gap-2">
            <CircleDashed size={16} class="text-slate-400" aria-hidden="true" />
            Not started
          </li>
        </ul>
      </section>
    </div>
  </div>
</dialog>
