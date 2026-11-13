<script>
  import './app.css';
	import planData from './assets/data/plan.json';

	let selectedPlan = '';
  // TODO: Implement an onClick for the submission to take the user to the main audit page
</script>

<main class="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100">
	<section class="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl shadow-black/30 sm:p-10">
		<div class="mb-6 text-center">
			<h1 class="m-0! text-3xl font-bold tracking-tight text-slate-50 sm:text-4xl">
				Degree Audit
			</h1>
			<p class="mt-2! text-base text-slate-400">
				Select your plan to get started.
			</p>
		</div>

		<div class="space-y-5">
			<div class="space-y-2 text-left">
				<label for="plan" class="block text-sm font-medium text-slate-300">Plan</label>
				<select
					id="plan"
					name="plan"
					bind:value={selectedPlan}
					class="block w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-base text-slate-100 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/20"
				>
					<option value="" disabled>Select a plan</option>
					{#each planData.plans as plan}
						<option value={plan.plan_code}>{plan.display}</option>
					{/each}
				</select>
			</div>

			<button
				type="button"
				class="w-full rounded-lg bg-indigo-500 px-5 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400/30"
			>
				View Degree Audit
			</button>
		</div>
	</section>
</main>

