<script>
  import { dark } from "../store";
  import { createEventDispatcher } from "svelte";

  export let isHalfWidth;

  const dispatch = createEventDispatcher();

  const handleSubmit = () => {
    dispatch("urlSubmission", document.getElementById("url").value);
  };

  let formClass = "flex relative text-gray-600 focus-within:text-gray-400";
  if (isHalfWidth === undefined || isHalfWidth === null || !isHalfWidth) {
    formClass += " w-full";
  }
  else {
    formClass += " w-1/2";
  }
</script>

<style>
</style>

<div class="flex flex-grow items-center justify-center">

  <form on:submit|preventDefault={handleSubmit}
    class="{formClass}">

    <span class="absolute inset-y-0 left-0 flex items-center pl-2">
      <button type="button" class="cursor-help has-tooltip"
        class:text-gray-700={$dark}
        class:text-gray-600={!$dark}>
        <svg viewBox="0 0 30 30" class="h-6 w-6 fill-current">
          <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM16.25 23.75H13.75V21.25H16.25V23.75ZM18.8375 14.0625L17.7125 15.2125C16.8125 16.125 16.25 16.875 16.25 18.75H13.75V18.125C13.75 16.75 14.3125 15.5 15.2125 14.5875L16.7625 13.0125C17.225 12.5625 17.5 11.9375 17.5 11.25C17.5 9.875 16.375 8.75 15 8.75C13.625 8.75 12.5 9.875 12.5 11.25H10C10 8.4875 12.2375 6.25 15 6.25C17.7625 6.25 20 8.4875 20 11.25C20 12.35 19.55 13.35 18.8375 14.0625Z" />
        </svg>
        <span class="text-left tooltip p-3 mt-1 lg:-mt-8 rounded-lg"
          class:text-gray-900={$dark} class:bg-gray-300={$dark}
          class:text-gray-300={!$dark} class:bg-gray-900={!$dark}>
          Enter a wiki URL here and then press enter or click on the magnifying glass to the right!
          <br /><br />
          It should look something like this: <br />
          https://en.wikipedia.org/wiki/Pet_door
        </span>
      </button>
    </span>

    <input type="url" name="url" id="url"
      pattern="[^#]+" title="# is not allowed"
      class="flex flex-grow py-2 text-sm rounded-md pl-10 focus:outline-none" placeholder="Enter URL..." required
      class:text-gray-900={$dark} class:bg-white={$dark}
      class:focus:text-white={$dark} class:focus:bg-gray-900={$dark}
      class:text-white={!$dark} class:bg-gray-900={!$dark}
      class:focus:text-gray-900={!$dark} class:focus:bg-white={!$dark} />

    <span class="absolute inset-y-0 right-0 flex items-center pl-2">
      <button type="submit" class="p-1 focus:outline-none focus:shadow-outline">
        <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" class="w-6 h-6">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </span>

  </form>

</div>
