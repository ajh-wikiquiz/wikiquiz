<script>
  import StartPage from "./components/StartPage.svelte";
  import UrlSearchBar from "./components/UrlSearchBar.svelte";
  import AppearanceToggler from "./components/AppearanceToggler.svelte";
  import { dark } from "./store";  // dark mode
  export let title;

  const handleUrlSubmission = (event) => {
    console.log(event.detail);
  };
</script>

<style>
</style>

<!-- Note: "class:dark" is equivalent (and short for) "class:dark={dark}" or "class:dark={dark === true}" -->
<main
  class="bg-gradient-to-br text-center"
  class:dark
  class:from-gray-700={$dark}
  class:to-gray-900={$dark}
  class:from-gray-300={!$dark}
  class:to-gray-500={!$dark}>

  <div class="flex flex-col min-h-screen max-h-screen">

    <div class="flex flex-row items-end justify-end p-3 space-x-8">
      <!-- <UrlSearchBar on:urlSubmission={handleUrlSubmission} /> -->
      <AppearanceToggler />
    </div>

    <StartPage title={title} on:urlSubmission={handleUrlSubmission} />

  </div>

</main>
