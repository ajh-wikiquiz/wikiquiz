<script>
  import QuestionCard from "../components/QuestionCard.svelte"
  import { dark } from "../store";  // dark mode
  import { createEventDispatcher } from "svelte";
  // Import Swiper Svelte components
  import { Swiper, SwiperSlide } from 'swiper/svelte';
  // Import Swiper styles
  import 'swiper/swiper.scss';

  export let quizData = [];

  const swiperOptions = {
    pagination: {
      el: '.swiper-pagination',
      clickable: false,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  };

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        let tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
  }

  let numCorrect = 0;
  const dispatch = createEventDispatcher();

  const handleCorrectAnswer = async (event) => {
    numCorrect += 1;
    if (numCorrect === quizData.length) {
      clearInterval(interval);
      // Brief sleep
      await new Promise((resolve) => setTimeout(resolve, 500));
      dispatch('completedQuiz', true);
    }
  };

  const getElapsedTimeInSeconds = () => {
    return Math.trunc(Math.abs(Date.now() - startTime) / 1000);
  };

  const getDisplayTime = (timeInSeconds) => {
    if (timeInSeconds > 60) {
      return `${Math.trunc(timeInSeconds / 60)} min ${timeInSeconds % 60} sec`
    }
    else {
      return `${timeInSeconds} sec`;
    }
  };

  const startTime = Date.now();
  let displayTime = getDisplayTime(getElapsedTimeInSeconds());

  const interval = setInterval(() => {
    displayTime = getDisplayTime(getElapsedTimeInSeconds());
  }, 500);
</script>

<div class="flex items-center justify-center">

  <div class="flex flex-grow" class:text-white={$dark} class:text-black={!$dark}>

    <div class="flex flex-row flex-grow mt-1 justify-between space-x-5">
      <div>Time spent on quiz: {displayTime}</div>
      <div>{numCorrect}/{quizData.length} correct</div>
    </div>

  </div>

</div>

<Swiper
  spaceBetween={50}
  slidesPerView={1}
  on:slideChange={() => console.log('slide change')}
  on:swiper={(e) => console.log(e.detail[0])}
>
  {#each quizData as question}
    <SwiperSlide>
      <QuestionCard
        question={question[0][0].blankedSentence}
        choices={shuffle(question[0][0].choices)}
        on:correctAnswer={handleCorrectAnswer} />
    </SwiperSlide>
  {/each}
</Swiper>
