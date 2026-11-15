<script>
  let { courseCode, credits, status = $bindable() } = $props();
</script>

<div class="relative border-2 rounded-2xl flex items-center justify-center p-4 bg-gray-600 text-white cursor-pointer w-33 overflow-clip">
  {courseCode}
  <span class="font-extralight absolute bottom-0 right-2">{credits}</span>
</div>
