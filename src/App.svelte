<script>
  import StartScreen from "./screens/StartScreen.svelte";
  import LoadingScreen from "./screens/LoadingScreen.svelte";
  import QuizScreen from "./screens/QuizScreen.svelte";
  import AppearanceToggler from "./components/AppearanceToggler.svelte";
  import UrlSearchBar from "./components/UrlSearchBar.svelte";
  import GetRandomArticleButton from "./components/GetRandomArticleButton.svelte";

  import { dark } from "./store";  // dark mode

  export let title;
  let urlStatus = 0;  // initial
  let responseJson;

  const handleUrlSubmission = async (event) => {
    urlStatus = 1;  // fetching data

    let response = await fetch('https://ajh-wikiscraper.herokuapp.com', {
      method: 'POST',
      headers: {'Content-Type': 'application/json;charset=utf-8',},
      body: JSON.stringify({'url': event.detail,})
    });
    responseJson = await response.json();

    setTimeout(() => {
      urlStatus = 2;  // data received
    }, 1000);
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

    <!-- Conditional states -->
    {#if urlStatus === 0}

      <!-- Top -->
      <div class="flex flex-row items-center justify-end p-3 space-x-8">
        <AppearanceToggler />
      </div>

      <!-- Content -->
      <StartScreen title={title} on:urlSubmission={handleUrlSubmission} />

    {:else if urlStatus === 1}

      <!-- Top -->
      <div class="flex flex-row items-center justify-end p-3 space-x-8">
        <AppearanceToggler />
      </div>

      <!-- Content -->
      <LoadingScreen title={title} />

    {:else if urlStatus === 2}

      <!-- Top -->
      <div class="flex flex-row items-center justify-between p-3 space-x-8">
        <UrlSearchBar isHalfWidth={false} on:urlSubmission={handleUrlSubmission} />
        <GetRandomArticleButton />
        <AppearanceToggler />
      </div>

      <!-- Content -->
      <QuizScreen data={responseJson['data']['contents']} />

    {/if}

  </div>

</main>
