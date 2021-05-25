<script>
  import { urlBarValue, articleImgSrc } from "../store";

  const handleRandomUrl = async () => {
    let response = await fetch(`https://wikigrab.herokuapp.com/get-random-articles?count=1`, {
      method: 'GET',
    });
    let responseJson = await response.json();

    $urlBarValue = responseJson['articles'][0]['url'];
  };
</script>

<div>
  <button on:click={() => handleRandomUrl()} type="button" class="btn btn-blue flex-shrink">
    Random URL
  </button>
</div>
