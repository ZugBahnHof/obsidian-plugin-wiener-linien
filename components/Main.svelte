<script lang="ts">
	import Train from "./Train.svelte";
	import {getDepartures} from "../scripts/wienerlinien";

	export let rblNumber;
	export let showRelatedLines = true;

	let departures = {monitors: []};
	let monitors = [];

	async function loadDepartures() {
		departures.monitors = (await getDepartures(rblNumber, showRelatedLines))?.monitors;
		console.log(departures);
	}

	$: (monitors = departures.monitors.reduce((acc, obj) => {
		const title = obj.locationStop.properties.title;
		const existingItem = acc.find(item => item.locationStop.properties.title === title);

		if (existingItem) {
			existingItem.lines.push(...obj.lines);
		} else {
			acc.push(obj);
		}

		return acc;
	}, []));
</script>

<div class="header">
	<h4>My Departures</h4>
	<button on:click={loadDepartures}>Reload</button>
</div>


{#each monitors as monitor}
	<h5>{monitor.locationStop.properties.title}</h5>
	{#each monitor.lines as line}
		<Train train="{line}"/>

	{/each}
{/each}

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
