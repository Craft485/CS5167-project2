<script>
	import {
		fetchCoursesForPlan,
		getCoursesToSatisfyRequirement,
		getRequirementFromKey,
		shellFunctionForPDFCreator,
	} from "../../utils";
	import { CircleX } from "@lucide/svelte";
	import PlanSelect from "../../components/PlanSelect.svelte"
	import Semester from "../../components/Semester.svelte";
	import InfoPanel from "../../components/InfoPanel.svelte";
	import { students } from "../../assets/data/student.json";
	import { student_courses } from "../../assets/data/student_courses.json";
	import { requirement_course } from "../../assets/data/requirement_course.json";
	import DetailsPane from "../../components/DetailsPane.svelte";
	import FilterModal from "../../components/FilterModal.svelte";

	let gpa = $state(3.14);
	let showDetailsModal = $state(false);
	let showFiltersModal = $state(false);
	let showInfo = $state(false);
	let appliedFilters = $state({
		courseCode: "",
		courseName: "",
		statuses: [],
		minCredits: "",
		maxCredits: "",
	});
	
	const buttonStyle = "rounded-2xl border-2 border-[#1d1d1d] bg-[#2b2b2b] px-3 py-1";
	const params = new URLSearchParams(window.location.search);
	let plan_code = $state(params.get("plan_code") ?? "BSCS");
	const student = students[0];
	let currentPlan = $derived(fetchCoursesForPlan(plan_code));
	// For electives, the course_code field will be the requirement id, otherwise its as you would expect
	let currentFocusId = $derived(currentPlan[0][0].course_code);
	let currentFocusRequirement = $derived(getRequirementFromKey(currentFocusId));
	let currentFocusRequirementCourseList = $derived(getCoursesToSatisfyRequirement(currentFocusRequirement?.requirement_id ?? ""));
	const semesterSeasons = ["FA", "SP", "SU"];
	const semesterLabel = (/** @type {number} */index) => {
		const year = 2023 + Math.floor((index + 2) / 3);
		return `${semesterSeasons[index % semesterSeasons.length]}${String(year).slice(-2)}`;
	};
	let totalCredits = $derived(currentPlan.flat().reduce((t, c) => t + c.credits, 0));
	let filteredPlan = $derived(currentPlan.map(semester => (semester ?? []).filter(course => {
		const courseCode = appliedFilters.courseCode.toLowerCase();
		const courseName = appliedFilters.courseName.toLowerCase();
		const status = getCourseStatus(course);
		const credits = Number(course.credits);

		return (!courseCode || String(course.course_code ?? "").toLowerCase().includes(courseCode))
			&& (!courseName || String(course.course_name ?? "").toLowerCase().includes(courseName))
			&& (!appliedFilters.statuses.length || appliedFilters.statuses.includes(status))
			&& (appliedFilters.minCredits === "" || credits >= Number(appliedFilters.minCredits))
			&& (appliedFilters.maxCredits === "" || credits <= Number(appliedFilters.maxCredits));
	})));
	let filteredCourseCount = $derived(filteredPlan.flat().length);

	function getCourseStatus(course) {
		const requirementIds = requirement_course
			.filter(entry => entry.course_code === course.course_code)
			.map(entry => entry.requirement_id);
		requirementIds.push(course.course_code);

		return student_courses.find(entry =>
			entry.m_number === student.m_number && requirementIds.includes(entry.requirement_id)
		)?.status ?? "not_started";
	}
</script>

<svelte:head>
	<title>Viewing Audit</title>
</svelte:head>

<main class="flex flex-col h-screen text-white bg-[#181818]">
	<section class="relative flex items-center mb-2 mt-1 mx-4 h-15">
		<!-- Header -->
		<div>
			<!-- Header Left Content -->
			<span class="pr-2 mr-1 border-r-2 border-r-gray-400">Current GPA: {gpa}</span>
			<span>Total Credits: {totalCredits}</span>
		</div>
		<div class="absolute z-1 w-[20%] inset-0 place-self-center">
			<PlanSelect bind:selectedPlan={plan_code} labelText="" />
		</div>
		<div class="absolute right-0">
			<!-- Header Right Content -->
			<button class={buttonStyle} onclick={shellFunctionForPDFCreator(plan_code, totalCredits)}>
				Export PDF
			</button>
			<button class={buttonStyle} onclick={() => showFiltersModal = !showFiltersModal}>
				Filter
			</button>
			<button class={buttonStyle} onclick={() => showInfo = !showInfo}>
				Info
			</button>
			<button class={buttonStyle} onclick={() => window.location.href = "/"}>
				Back
			</button>
		</div>
	</section>
	
	<section class="flex gap-4 overflow-x-scroll grow px-4">
		<!-- Body -->
		{#if filteredCourseCount === 0}
			<p class="self-center w-full text-center text-slate-300">No courses match these filters.</p>
		{/if}
		{#each currentPlan as _semester, i}
			{#if filteredPlan[i]?.length}
				<Semester
					courses={filteredPlan[i]}
					label={semesterLabel(i)}
					{student}
					{student_courses}
					{requirement_course}
					bind:showDetailsModal={showDetailsModal}
					bind:currentFocusId={currentFocusId}
				/>
			{/if}
		{/each}
	</section>
</main>

{#if showDetailsModal}
	<section class="flex justify-center items-center absolute z-5 inset-0 bg-[#181818]/50 text-white">
		<div class="relative w-[50%] min-h-[50%] max-h-[80%] overflow-y-scroll border-4 border-[#1d1d1d] bg-[#2b2b2b] rounded-xl p-4">
			<span class="absolute top-2 right-2 cursor-pointer p-1 hover:bg-white/10">
				<CircleX color="red" onclick={() => showDetailsModal = !showDetailsModal} />
			</span>
			{#if currentFocusRequirement}
				<DetailsPane requirement={currentFocusRequirement} courses={currentFocusRequirementCourseList} />
			{/if}
		</div>
	</section>
{/if}

{#if showFiltersModal}
	<FilterModal
		initialFilters={appliedFilters}
		onApply={(filters) => {
			appliedFilters = filters;
			showFiltersModal = false;
		}}
		onClose={() => showFiltersModal = false}
	/>
{/if}

{#if showInfo}
	<InfoPanel onclose={() => showInfo = false} />
{/if}
