<script>
  import { dark } from "../store";  // dark mode

  export let data;

  // Functions
  const getElapsedTimeInSeconds = () => {
    return Math.trunc(Math.abs(Date.now() - startTime) / 1000);
  };
  const updateElapsedTime = () => {
    elapsedTime = getElapsedTimeInSeconds();
  };

  // Runtime
  const startTime = Date.now();
  let elapsedTime = getElapsedTimeInSeconds();

  setInterval(updateElapsedTime, 1000);
</script>

<style>
</style>

<div class="flex items-center justify-center">

  <div class="flex flex-grow" class:text-white={$dark} class:text-black={!$dark}>

    <div class="flex flex-col flex-grow items-center justify-center mt-5 space-y-5">
      <div>
        {data[0]['content']} <br />  <!-- TODO: dynamically create questions and answers based on data -->
        a. some multiple choice answer here <br />
        b. some multiple choice answer here <br />
        c. some multiple choice answer here <br />
      </div>
      <div>
        Elapsed Time: {elapsedTime}
      </div>
    </div>

  </div>

</div>
