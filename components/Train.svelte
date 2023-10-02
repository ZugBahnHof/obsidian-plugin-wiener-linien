<script lang="ts">
	import Departure from "./Departure.svelte";

	export let train;
	let trainName: string;
	let background: string;
	let color: string;

	const colors = {
		ptTramVRT: "#d3312c",
		ptTramWLB: "#245e92",
		ptMetro: {
			U1: "#e20210",
			U2: "#935e98",
			U3: "#db7609",
			U4: "#319f49",
			U5: "#008085",
			U6: "#a4642c",
		},
		ptTram: "#d3312c",
		ptBusCity: "#1c60a7",
		ptBusNight: "#213d6b",
	}

	$: (trainName = train.name.slice(0, 1).toUpperCase() + train.name.slice(1).toLowerCase())
	$: (color = train.type === "ptBusNight" ? "#f6e603" : "#fff")
	$: (background =
		train.type === "ptMetro" ? colors[train.type][train.name] : colors[train.type] || "#565656")
</script>

<div class="train">
	<div class="number" style="background: {background}; color: {color}">
		{trainName}
	</div>
	<div class="direction">{train.towards}</div>
	<div class="departures">
		{#each train.departures.departure.slice(0, 2) as departure}
			<Departure departureTime={departure.departureTime} barrierFree="{train.barrierFree}" vehicleInfo="{departure.vehicle}"/>
		{/each}
	</div>
</div>

<style>
	.train {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5em 0;
	}

	.number {
		aspect-ratio: 1;
		color: white;
		width: 3em;
		line-height: 3em;
		text-align: center;
	}

	.departures {
		display: flex;
		gap: .5em;
	}
</style>
