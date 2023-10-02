<script lang="ts">
  export let variable: number = 0;
</script>

<h4>Hello World</h4>

<button on:click={() => {variable = variable+1}}>
	  Click me
</button>

<div class="number">
  <span>My number is {variable}!</span>
</div>

<style>
  .number {
    color: red;
  }
</style>
