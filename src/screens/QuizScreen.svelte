<script>
  import QuestionCard from "../components/QuestionCard.svelte"
  import { dark } from "../store";  // dark mode

  export let data;
  let choices;

  // Functions
  const getElapsedTimeInSeconds = () => {
    return Math.trunc(Math.abs(Date.now() - startTime) / 1000);
  };
  const updateElapsedTime = () => {
    elapsedTime = getElapsedTimeInSeconds();
  };

  const getChoices = async () => {
    // let important = await fetch(`https://ajh-getimportant.herokuapp.com/phrases/${data[0]['content']}`, {
    //   method: 'GET',
    // });
    // let importantJson = await important.json();
    // let similar = await fetch(`https://ajh-getsimilar.herokuapp.com/phrases/${importantJson['data']['phrases'][0]['text']}`, {
    //   method: 'GET',
    // });
    // let similarJson = await similar.json();
    // return await similarJson['data']['similar'];
    // return ['some choice a', 'some choice b', 'some choice c'];
  };

  // Runtime
  // choices = getChoices();

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

        <!-- TODO: dynamically create questions and answers based on data -->
        <QuestionCard question={data[0]['content']} choices={['some choice a', 'some choice b', 'some choice c']} />

      </div>
      <div>
        Elapsed Time: {elapsedTime}
      </div>
    </div>

  </div>

</div>
