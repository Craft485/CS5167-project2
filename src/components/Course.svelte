<script>
  let { courseCode, credits, status = $bindable(), showDetailsModal = $bindable() } = $props();
</script>

<button
  class="relative border-2 border-[#1d1d1d] rounded-2xl flex items-center justify-center p-4 bg-[#2b2b2b] text-white cursor-pointer w-33 overflow-clip"
  onclick={() => showDetailsModal = !showDetailsModal}
>
  {courseCode}
  <span class="font-extralight absolute bottom-0 right-2">{credits}</span>
</button>
