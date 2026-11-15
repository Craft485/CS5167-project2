<script>
	import PlanSelect from "../../components/PlanSelect.svelte"
	import Semester from "../../components/Semester.svelte";
	import { fetchCoursesForPlan } from "../../utils.svelte"

	let gpa = $state(3.14);

	const params = new URLSearchParams(window.location.search);
	let plan_code = $state(params.get("plan_code") ?? "BSCS");
	let currentPlan = $derived(fetchCoursesForPlan(plan_code));

</script>

<svelte:head>
	<title>Viewing Audit</title>
</svelte:head>

<main class="flex flex-col h-screen text-white">
	<section class="flex items-center mb-2 mt-1 px-4">
		<!-- Header -->
		<div>
			<!-- Header Left Content -->
			Current GPA: {gpa}
		</div>
		<div class="relative z-10 flex flex-col gap-0.5 mx-auto w-[20%] h-15">
			<PlanSelect bind:selectedPlan={plan_code} labelText="" />
		</div>
		<div>
			<!-- Header Right Content -->
			<button onclick={() => window.location.href = "/"}>Back</button>
		</div>
	</section>
	
	<section class="flex gap-4 overflow-x-scroll grow px-4">
		<!-- Body -->
		{#each currentPlan as semester, i}
			<Semester courses={semester} label={`S${i + 1}`} />
		{/each}
	</section>
</main>
