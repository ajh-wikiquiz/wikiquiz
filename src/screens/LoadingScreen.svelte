<script>
  import Title from "../components/Title.svelte";
  import { dark } from "../store";

  export let title;
  export let loadingText;
  export let articleImgSrc;
</script>

<div class="flex items-center justify-center">

  <div class="flex flex-col flex-grow" class:text-white={$dark} class:text-black={!$dark}>

    <Title title={title} />

    <div class="flex flex-col flex-grow items-center justify-center mt-5 space-y-5">
      <div>
        {#each loadingText as text}
          {text} <br />
        {/each}
        Please wait...
      </div>
      <div class="px-8 pb-8">
        <img id="articleImg" class="max-w-full" src="{ articleImgSrc }" alt="" />  <!-- TODO: custom alt text dependent on image -->
      </div>
    </div>

  </div>

</div>
