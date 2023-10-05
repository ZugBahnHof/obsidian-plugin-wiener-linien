<script lang="ts">
	import Train from "./Train.svelte";
	import {getDepartures} from "../scripts/wienerlinien";
	import {onDestroy, onMount} from "svelte";
	import {moment} from "obsidian";

	export let rblNumbers: string[];
	export let showRelatedLines = true;

	let tmp: unknown[] = [];

	let departures = {
		monitors: [] as unknown[],
	};
	let monitors: unknown[] = [];
	let lastRefresh: moment.Moment;
	let lastRefreshReadable: string;

	async function loadDepartures() {
		departures.monitors = (await getDepartures(rblNumbers, showRelatedLines))?.monitors as typeof monitors;
		lastRefresh = moment();

		console.log(departures);
	}

	onMount(loadDepartures)

	$: (monitors = departures.monitors.reduce((acc: Array<any>, obj: any) => {
		const title = obj.locationStop.properties.title;
		const existingItem = acc.find(item => item.locationStop.properties.title === title);

		if (existingItem) {
			existingItem.lines.push(...obj.lines);
		} else {
			acc.push(obj);
		}

		return acc;
	}, []));

	function updateTime(_?: moment.Moment) {
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
	<div title="{lastRefresh.format('MMMM Do YYYY, h:mm:ss a')}">Last refresh: {lastRefreshReadable}</div>
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
