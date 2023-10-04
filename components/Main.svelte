<script lang="ts">
	import Train from "./Train.svelte";
	import {getDepartures} from "../scripts/wienerlinien";
	import {onDestroy, onMount} from "svelte";
	import {moment} from "obsidian";


	export let rblNumber;
	export let showRelatedLines = true;

	let departures = {monitors: []};
	let monitors = [];
	let lastRefresh: moment;
	let lastRefreshReadable: string;

	async function loadDepartures() {
		departures.monitors = (await getDepartures(rblNumber, showRelatedLines))?.monitors;
		lastRefresh = moment();

		console.log(departures);
	}

	onMount(loadDepartures)

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

	function updateTime (newTime?: moment){
		lastRefreshReadable = lastRefresh?.fromNow()
		console.debug("Updating time")
	}

	$: updateTime(lastRefresh)

  	let interval = setInterval(() => updateTime(), 30000);

	onDestroy(() => {
		clearInterval(interval);
		console.debug("Interval cleared");
	});
</script>

<div class="header">
	<h4>My Departures</h4>
	<button on:click={loadDepartures}>Reload</button>
</div>

{#if lastRefresh}
	<div title="{lastRefresh}">Last refresh: {lastRefreshReadable}</div>
{/if}


{#each monitors as monitor}
	<h5>{monitor.locationStop.properties.title}</h5>
	{#each monitor.lines as line}
		<Train train="{line}"/>
	{:else}
		<p>No departures at this time.</p>
	{/each}
{:else}
	<p>Couldn't find departures. Please try reloading</p>
{/each}

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>
