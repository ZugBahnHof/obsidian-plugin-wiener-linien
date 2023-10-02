<script lang="ts">
	import Train from "./Train.svelte";
	import {getDepartures} from "../scripts/wienerlinien";

	export let rblNumber;

	let departures = {monitors: []};

	async function loadDepartures() {
		departures.monitors = (await getDepartures(rblNumber))?.monitors;
		console.log(departures);
	}
</script>

<h4>My Departures</h4>

<button on:click={loadDepartures}>Reload</button>


{#each departures.monitors as monitor}
	<h5>{monitor.locationStop.properties.title}</h5>
	{#each monitor.lines as line}
		<Train train="{line}" />

	{/each}
{/each}
