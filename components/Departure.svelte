<script lang="ts">
	export let departureTime: Object;
	export let barrierFree: boolean;
	export let vehicleInfo: Object | undefined;

	let symbol: string;

	/*
	 * Cases for symbol:
	 * if no custom vehicle value is set, use the default value → show dot if barrier free
	 * if custom vehicle value is set, use the custom value → show dot if barrier free and dash if foldingRamp
	 */

	$: (symbol = vehicleInfo?.barrierFree === undefined ? (
		barrierFree ? '•' : '') : (vehicleInfo?.barrierFree ? '•' : (vehicleInfo?.foldingRamp ? '—' : '')))
</script>

<span style="color: {departureTime.timePlanned === departureTime.timeReal ? 'unset' : 'red'}">
	{departureTime.countdown}
	<sub class="below">{symbol}</sub>
</span>

<style>
	span {
		display: inline-block;
		position: relative;
	}
	.below {
		position: absolute;
		bottom: -1em;
		left: 0;
		text-align: center;
		width: 100%;
	}
</style>
