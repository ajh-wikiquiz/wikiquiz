<script>
  import Title from "../components/Title.svelte";
  import UrlSearchBar from "../components/UrlSearchBar.svelte";
  import GetRandomArticleButton from "../components/GetRandomArticleButton.svelte";
  import { dark } from "../store";

  export let title;
</script>

<div class="flex items-center justify-center">

  <div class="flex flex-col flex-grow space-y-8" class:text-white={$dark} class:text-black={!$dark}>

    <Title title={title} />
    <UrlSearchBar atStartScreen on:urlSubmission />
    <GetRandomArticleButton atStartScreen on:randomUrlRequest />

  </div>

</div>
