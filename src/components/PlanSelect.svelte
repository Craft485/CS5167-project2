<script>
  import planData from '../assets/data/plan.json';
  let { selectedPlan = $bindable(), labelText = "Plan: " } = $props();
</script>

<label for="plan" class="block text-sm font-medium text-slate-300">{labelText}</label>
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
