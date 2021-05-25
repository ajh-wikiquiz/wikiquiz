<script>
  export let question;
  export let choices;
</script>

<div>
  {question} <br />
  {#each choices as choice, i}
    <input name="TODO REPLACE" type="radio" id="{ `${choice}_${i}` }" /><label for="{ `${choice}_${i}` }">{ choice }</label><br />
  {/each}
</div>
