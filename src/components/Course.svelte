<script>
  import { CircleCheck, CircleDashed, Clock3 } from "@lucide/svelte";

  let {
    courseCode,
    displayName,
    credits,
    status,
    showDetailsModal = $bindable(),
    color = $bindable(),
  } = $props();

  const statusLabels = {
    completed: "Completed",
    in_progress: "In progress",
    not_started: "Not started",
  };
</script>

<button
  class="relative border-2 border-[#1d1d1d] rounded-2xl flex items-center justify-center p-4 bg-[#2b2b2b] text-white cursor-pointer h-16 w-33 truncate"
  onclick={() => showDetailsModal = !showDetailsModal}
  style:border-color={color}
>
  {#if status === "completed"}
    <span class="absolute right-1 top-1 text-emerald-400" role="img" aria-label={statusLabels[status]} title={statusLabels[status]}>
      <CircleCheck size={16} aria-hidden="true" />
    </span>
  {:else if status === "in_progress"}
    <span class="absolute right-1 top-1 text-amber-300" role="img" aria-label={statusLabels[status]} title={statusLabels[status]}>
      <Clock3 size={16} aria-hidden="true" />
    </span>
  {:else if status === "not_started"}
    <span class="absolute right-1 top-1 text-slate-400" role="img" aria-label={statusLabels[status]} title={statusLabels[status]}>
      <CircleDashed size={16} aria-hidden="true" />
    </span>
  {/if}
  {displayName || courseCode}
  <span class="font-extralight absolute bottom-0 right-2">{credits}</span>
</button>
