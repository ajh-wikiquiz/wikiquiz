<script>
  import { createEventDispatcher } from "svelte";

  export let atStartScreen = false;

  let textClass = "";
  if (!atStartScreen) {
    textClass += " hidden sm:inline-block";
  }

  const dispatch = createEventDispatcher();

  const handleRandomUrl = async () => {
    dispatch("randomUrlRequest");
  }
</script>

<div>
  <button on:click={() => handleRandomUrl()} type="button" class="btn btn-blue">
    Random <span class="{textClass}">URL</span>
  </button>
</div>
