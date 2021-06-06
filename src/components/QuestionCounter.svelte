<script>
  import { dark, numQuestionsToGenerate } from "../store";

  export let atStartScreen = false;

  let labelClass = "";
  if (!atStartScreen) {
    labelClass += " hidden md:inline-block";
  }
  else {
    labelClass += " inline-block";
  }

  const handleDecrement = () => {
    if ($numQuestionsToGenerate > 1) {
      $numQuestionsToGenerate -= 1
    }
  }
</script>

<div class="flex flex-row">

  <span class="has-tooltip select-none">
    <button class="cursor-help"
      class:text-gray-600={$dark}
      class:text-gray-500={!$dark}>
      <svg viewBox="0 0 30 30" class="h-6 w-6 fill-current">
        <path d="M15 2.5C8.1 2.5 2.5 8.1 2.5 15C2.5 21.9 8.1 27.5 15 27.5C21.9 27.5 27.5 21.9 27.5 15C27.5 8.1 21.9 2.5 15 2.5ZM16.25 23.75H13.75V21.25H16.25V23.75ZM18.8375 14.0625L17.7125 15.2125C16.8125 16.125 16.25 16.875 16.25 18.75H13.75V18.125C13.75 16.75 14.3125 15.5 15.2125 14.5875L16.7625 13.0125C17.225 12.5625 17.5 11.9375 17.5 11.25C17.5 9.875 16.375 8.75 15 8.75C13.625 8.75 12.5 9.875 12.5 11.25H10C10 8.4875 12.2375 6.25 15 6.25C17.7625 6.25 20 8.4875 20 11.25C20 12.35 19.55 13.35 18.8375 14.0625Z" />
      </svg>
    </button>
    <span class="text-left tooltip p-3 mt-1 lg:-mt-8 rounded-lg top-12 right-0 sm:right-12 md:right-20 lg:top-20 lg:right-28"
      class:text-gray-900={$dark} class:bg-gray-300={$dark}
      class:text-gray-300={!$dark} class:bg-gray-900={!$dark}>
      Adjust the maximum number of questions to generate per wiki article here! <br />
      Note: The time to generate the quiz may increase dramatically. ):
    </span>
  </span>

  <div class="flex flex-row space-x-2 select-none">
    <span class="{labelClass}">Questions:&nbsp;</span>{$numQuestionsToGenerate}
    <button on:click={handleDecrement} type="button" class="btn-q-counter">
      -
    </button>
    <button on:click={() => {$numQuestionsToGenerate += 1}} type="button" class="btn-q-counter">
      +
    </button>
  </div>
</div>
