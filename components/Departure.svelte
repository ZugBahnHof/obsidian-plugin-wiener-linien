<script lang="ts">
	export let departureTime: Object;
</script>

<span style="color: {departureTime.timePlanned === departureTime.timeReal ? 'unset' : 'red'}">
	{departureTime.countdown}
</span>
