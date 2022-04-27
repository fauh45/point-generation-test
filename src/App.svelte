<script lang="ts">
  import Map from "./lib/Map.svelte";

  let points: Array<[number, number]> = [
    [107.62244361910179, -6.8140185621132705],
    [107.5864863868797, -6.784596923108357],
    [107.58562423879562, -6.725317618619614],
  ];

  let halfenRecursion = 2;
  let randomRadius = 0.015;
</script>

<main>
  <Map {halfenRecursion} {randomRadius} {points} />

  <div>
    <p>
      Warning: High Number of Line Recursion could lead to a hang on the page
    </p>
    <form class="content">
      <label for="recursion">Line Recursion Amount</label>
      <input id="recursion" type="number" bind:value={halfenRecursion} />

      <label for="radius">Random Radius</label>
      <input id="radius" type="number" bind:value={randomRadius} />
    </form>
  </div>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  .content {
    display: grid;
    grid-template-columns: 20% 80%;
    grid-column-gap: 10px;
  }
</style>
