<script>
  import Title from "../components/Title.svelte";
  import { dark, articleImgSrc } from "../store";  // dark mode

  export let title;
</script>

<style>
</style>

<div class="flex items-center justify-center">

  <div class="flex flex-col flex-grow" class:text-white={$dark} class:text-black={!$dark}>

    <Title title={title} />

    <div class="flex flex-col flex-grow items-center justify-center mt-5 space-y-5">
      <div>
      Generating flashcards... <br />
      Please wait...
      </div>
      <div>
        <img id="articleImg" src="{ $articleImgSrc }" alt="<use team img scraper here>" />
      </div>
    </div>

  </div>

</div>
