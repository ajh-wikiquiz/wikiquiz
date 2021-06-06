<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  const handleRandomUrl = async () => {
    dispatch("randomUrlRequest");
  }
</script>

<div>
  <button on:click={() => handleRandomUrl()} type="button" class="btn btn-blue">
    Random <span class="hidden sm:inline-block">URL</span>
  </button>
</div>
