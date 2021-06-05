<script>
  import { createEventDispatcher } from "svelte";

  export let question;
  export let choices;

  const dispatch = createEventDispatcher();

  const handleChoiceClick = (i, isCorrect) => {
    let el = document.getElementById(`${choices[i].choice.split(' ').join('-')}-${i}`);
    if (isCorrect === true) {
      el.classList.remove('choice');
      el.classList.add('choice-correct');
      dispatch('correctAnswer', true);
    }
    else {
      el.classList.remove('choice');
      el.classList.add('choice-incorrect');
    }
  };
</script>

<!-- Question -->
<div class="pt-6 px-6 py-6 rounded shadow-lg">
  <div>
    {question} <br />
  </div>
  <div class="pt-6">
    {#each choices as choice, i}
      <button
        id="{choice.choice.split(' ').join('-')}-{i}"
        class="choice"
        type="button"
        on:click|once={() => handleChoiceClick(i, choice.isCorrect)}
      >
        {choice.choice}
      </button>
    {/each}
  </div>
</div>
