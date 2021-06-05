<script>
  import { urlBarValue, randomUrls, randomUrlsIndex } from "../store";

  export let fetchCount = 10;  // Number of random urls to fetch at a time and cache.

  const handleRandomUrl = async () => {
    if ($randomUrlsIndex % fetchCount == 0) {
      // Set to 1 immediately to avoid running multiple times while waiting.
      $randomUrlsIndex = 1;
      let wikigrabPromise = await fetch(`https://wikigrab.herokuapp.com/get-random-articles?count=${fetchCount}`);
      let wikigrabResponse = await wikigrabPromise.json();
      $randomUrls = wikigrabResponse['articles'].map(i => i['url']);
      $urlBarValue = $randomUrls[0];
    }
    else {
      $urlBarValue = $randomUrls[$randomUrlsIndex];
      $randomUrlsIndex++;
    }
  };
</script>

<div>
  <button on:click={() => handleRandomUrl()} type="button" class="btn btn-blue flex-shrink">
    Random URL
  </button>
</div>
