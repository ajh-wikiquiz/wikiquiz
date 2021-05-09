<script>
  import UrlSearchBar from "./UrlSearchBar.svelte"
  import { dark } from "../store";  // dark mode
  export let title;
</script>

<style>
</style>

<div class="flex items-center justify-center">

  <div class="flex flex-col flex-grow" class:text-white={$dark} class:text-black={!$dark}>
    <h1 class="bg-clip-text font-black text-5xl sm:text-6xl md:text-7xl leading-tight mt-5">{title}</h1>

    <UrlSearchBar on:urlSubmission /><!-- pass urlSubmission event to parent -->

  </div>

</div>
