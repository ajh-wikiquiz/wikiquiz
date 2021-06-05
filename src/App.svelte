<script>
  import StartScreen from "./screens/StartScreen.svelte";
  import LoadingScreen from "./screens/LoadingScreen.svelte";
  import QuizScreen from "./screens/QuizScreen.svelte";
  import CongratsScreen from "./screens/CongratsScreen.svelte";
  import AppearanceToggler from "./components/AppearanceToggler.svelte";
  import UrlSearchBar from "./components/UrlSearchBar.svelte";
  import GetRandomArticleButton from "./components/GetRandomArticleButton.svelte";
  import QuestionCounter from "./components/QuestionCounter.svelte";
  import { dark, numQuestionsToGenerate, urlBarValue } from "./store";
	import { fly } from 'svelte/transition';

  export let title;

  // Warm up the services to be used in this app.
  console.log('Warming up services to be used.');
  fetch('https://ajh-wikiscraper.herokuapp.com');
  fetch('https://ajh-getimportant.herokuapp.com');
  fetch('https://ajh-getsimilar.herokuapp.com');
  fetch('https://ajh-fillmask.herokuapp.com');
  fetch('https://wikigrab.herokuapp.com');
  fetch('https://wiki-service-361.herokuapp.com');

  let status = 0;  // initial
  let articleImgSrc;
  let quizData;
  let loadingText = [];
  const transitionTime = 500;  // in milliseconds

  /// Refreshes the page.
  function resetPage() {
    loadingText = ['Error encountered, resetting.'];
    articleImgSrc = '';
    status = 1;
    window.location.reload();
  }

  /// Tries the passed async function for n times. Throws an error if all the
  /// tries have been exhausted.
  async function tryFor(times, fn, ...args) {
    if (times < 1) {
      return;
    }

    let timeout = 1.9;  // in seconds
    for (let i = 0; i < times; i++) {
      try {
        return await fn(...args);
      }
      catch(err) {
        // Final try
        if (i === times-1 ) {
          throw new Error(`All ${times} tries failed for ${fn.name}.`);
        }
        await new Promise(resolve => setTimeout(resolve, timeout * 1000));
        timeout = timeout ** 2;  // Exponential retry time.
      }
    }
  }

  /// Returns the parsed text content of a wiki article.
  async function getTextContent(url, charCutoff = 10) {
    return (await (await fetch(
      `https://ajh-wikiscraper.herokuapp.com`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({'url': url}),
      }))
      .json())['data']['contents']  // Only use what's necessary from the response.
      .filter(section => section.content.length > charCutoff)  // Ignore sections with little to no content.
      .filter(section => !section.content.includes('mw-parser'));  // Ignore sections with junk until scraper is fixed.
  }

  /// Returns new sentences with the important phrases in the sentences
  /// replaced with the specified token.
  function getMaskedSentences(sentences, phrase, token) {
    const maskedPhrase = phrase.split(' ').map(() => token).join(' ');
    return sentences.map((sentence) => sentence.replace(phrase, maskedPhrase));
  }

  /// Returns new sentences with the important phrases in the sentences
  /// replaced with an equivalent length string of underscores.
  function getBlankedSentences(sentences, phrase, underscoreLength = 3) {
    const blankedPhrase = phrase.split(' ')
      .map((word) => underscoreLength ? '_'.repeat(underscoreLength) : '_'.repeat(word.length))
      .join(' ');
    return sentences.map((sentence) => sentence.replace(phrase, blankedPhrase));
  }

  /// Returns the most important phrases and their associated sentences.
  async function getImportant(content, topn = 1) {
    return (await (await fetch(
      `https://ajh-getimportant.herokuapp.com/phrases`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({'text': content, 'topn': topn}),
      }))
      // Only use what's necessary from the response.
      .json())['data']['phrases']
      .map((phrase) => {
        return {
          'text': phrase.text,
          'sentences': [...new Set(phrase.sentences)],  // Remove duplicates.
        }
      });
  }

  /// Returns some possible choices for the masks in the sentence.
  async function getChoices(maskedSentence, topn = 5) {
    return (await (await fetch(
      `https://ajh-fillmask.herokuapp.com/suggestions`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({'text': maskedSentence, 'topn': topn}),
      }))
      // Only use what's necessary from the response.
      .json())['data']['suggestions']
      .map(suggestion => {
        return suggestion.map((word) => {
          return word.text;
        });
      });
  }

  /// Returns similar text.
  async function getSimilar(text, topn = 5) {
    return (await (await fetch(
      `https://ajh-getsimilar.herokuapp.com/similar`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json;charset=utf-8'},
        body: JSON.stringify({'text': text, 'topn': topn}),
      }))
      // Only use what's necessary from the response.
      .json())['data']['similar']
      .map(suggestion => suggestion.text);
  }

  /// Returns the article's first image.
  async function getArticleImgSrc(url) {
    return (await (await fetch(
      `https://wiki-service-361.herokuapp.com/image/?url=${url}`))
      // Only use what's necessary from the response.
      .json())['IMAGE_URL']
  }

  /// Returns a slice of the string that includes the mandatory text, but
  /// limited to n characters.
  function getSurroundingText(text, mandatoryText, limit = 800) {
    let charsRemaining = limit - mandatoryText.length;
    let startIndex = text.indexOf(mandatoryText);
    let endIndex = startIndex + mandatoryText.length;  // non-inclusive end
    if (charsRemaining > 0) {
      let halfCharsRemaining = Math.floor(charsRemaining / 2);
      startIndex = startIndex - halfCharsRemaining;
      if (startIndex < 0) {
        startIndex = 0;
      }
      charsRemaining -= startIndex - halfCharsRemaining;
      endIndex += charsRemaining;
      if (endIndex > text.length) {
        endIndex = text.length;
      }
    }
    return text.slice(startIndex, endIndex);
  }

  /// Processes the data and assigns it to be used for the QuizScreen.
  async function generateQuizData(url, limit = 2) {
    quizData = [];

    loadingText[0] = 'Retrieving text content of the article...';
    // Get text content of article.
    let data = (await tryFor(3, getTextContent, url).catch((error) => {
      resetPage();
    })).slice(0, limit);

    for (let section of data) {
      loadingText[0] = 'Finding the important phrases...';
      // Get important phrases and sentences for each section.
      let important = await tryFor(3, getImportant, section.content).catch(
        (error) => null
      );
      if (important === null) {
        continue;
      }

      let quizSection = [];
      // For every important phrase, get their masked and blanked sentences.
      for (let i = 0; i < important.length; i++) {
        loadingText[0] = 'Generating questions...';
        let maskedSentences = getMaskedSentences(
          // Use section content for context.
          [getSurroundingText(section.content, important[i].text)],
          important[i].text,
          '[MASK]',
        );
        let blankedSentences = getBlankedSentences(
          [important[i].sentences[0]],  // only use one question per section
          important[i].text,
          3,  // underscoreLength
        );
        // Create the questions for the quiz section.
        for (let j = 0; j < blankedSentences.length; j++) {
          loadingText[0] = 'Creating multiple choice answers...';
          blankedSentences[j] = {
            'blankedSentence': blankedSentences[j],
            'choices': (await tryFor(3, getChoices, maskedSentences[j])
              .catch((error) => [])),
          }
          // Ignore questions that failed to get multiple choice answers.
          if (blankedSentences[j].choices.length == 0) {
            continue;
          }
          loadingText[0] = 'Removing redundant answers...';
          // Replace any words in the choices with hashtags.
          blankedSentences[j].choices = (await Promise.all(blankedSentences[j].choices
            .map(async choice => {
              for (let k = 0; k < choice.length; k++) {
                // choice[k] are the individual tokens or words within a choice.
                if (
                  choice[k].includes('#') ||
                  choice[k].includes('[UNK]') ||
                  important[i].text.toLowerCase().includes(choice[k].toLowerCase()) ||
                  choice.indexOf(choice[k]) !== k  // check if is first occurence of this string in array
                ) {
                  let similarWords = await tryFor(3, getSimilar, choice[k], 20)
                    .catch((error) => null);
                  if (similarWords !== null) {
                    for (let l = 0; l < 20; l++) {
                      choice[k] = similarWords[
                        Math.floor(Math.random() * similarWords.length)];
                      if (
                        choice[k].includes('#') ||
                        choice[k].includes('[UNK]') ||
                        important[i].text.toLowerCase().includes(choice[k].toLowerCase()) ||
                        choice.indexOf(choice[k]) !== k  // Check if is first occurence of this string in array.
                      ) {
                        similarWords.splice(similarWords.indexOf(choice[k]));  // Remove from lotto so it doesn't get picked again.
                      }
                      else {
                        break;
                      }
                    }
                  }
                }
              }
              return {'choice': choice.join(' '), 'isCorrect': false};
            }))).concat([{'choice': important[i].text, 'isCorrect': true}]);
        }
        blankedSentences = blankedSentences
          .filter((sentence) => sentence.choices.length > 0);
        // Add questions to the quiz section.
        if (blankedSentences.length > 0) {
          quizSection.push(Promise.all(blankedSentences));
        }
      }
      if (quizSection.length > 0) {
        quizData.push(Promise.all(quizSection));
      }
    };
    quizData = await Promise.all(quizData);
  }

  const handleUrlSubmission = async (event) => {
    if (status === 3) {
      // Clear CongratsScreen, wait for the animation to complete.
      status = 3.5;
      await new Promise((resolve) => setTimeout(resolve, transitionTime));
    }
    status = 1;

    loadingText[0] = 'Fetching image...';
    // Update loading screen image.
    articleImgSrc = await tryFor(2, getArticleImgSrc, $urlBarValue).catch(
      (error) => ''
    );

    loadingText[0] = 'Generating quiz...';
    await generateQuizData(event.detail, $numQuestionsToGenerate);

    if (quizData.length == 0) {
      resetPage();
    }

    loadingText[0] = 'Done!';
    status = 2;  // done receiving processing data
    articleImgSrc = '';  // clear image for next
  };

  const handleCompletedQuiz = async (event) => {
    status = 3;
  }
</script>

<!-- Note: "class:dark" is equivalent (and short for) "class:dark={dark}" or "class:dark={dark === true}" -->
<main
  class="bg-gradient-to-br text-center flex flex-col min-h-screen min-w-full"
  class:dark
  class:from-gray-700={$dark}
  class:to-gray-900={$dark}
  class:from-gray-300={!$dark}
  class:to-gray-500={!$dark}>

  <!-- Conditional states -->
  {#if status === 0}

    <!-- Top -->
    <div class="flex flex-row items-center justify-end p-3 pt-6 space-x-8">
      <!-- <AppearanceToggler /> -->
      <QuestionCounter />
    </div>

    <!-- Content -->
    <StartScreen title={title} on:urlSubmission={handleUrlSubmission} />

  {:else if status === 1}

    <!-- Top -->
    <div class="flex flex-row items-center justify-end p-3 pt-6 space-x-8">
      <QuestionCounter />
    </div>

    <!-- Content -->
    <LoadingScreen title={title} loadingText={loadingText} articleImgSrc={articleImgSrc} />

  {:else if status === 2}

    <!-- Top -->
    <div class="flex flex-row items-center justify-between p-3 pt-6 space-x-8">
      <UrlSearchBar isHalfWidth={false} on:urlSubmission={handleUrlSubmission} />
      <GetRandomArticleButton />
      <QuestionCounter />
      <!-- <AppearanceToggler /> -->
    </div>

    <!-- Content -->
    <div class="p-8">
      <QuizScreen quizData={quizData} on:completedQuiz={handleCompletedQuiz} />
    </div>

  {:else if status === 3}

  <div transition:fly="{{ y: 200, duration: transitionTime }}">
    <!-- Top -->
    <div class="flex flex-row items-center justify-between p-3 pt-6 space-x-8">
      <UrlSearchBar isHalfWidth={false} on:urlSubmission={handleUrlSubmission} />
      <GetRandomArticleButton />
      <QuestionCounter />
      <!-- <AppearanceToggler /> -->
    </div>

    <!-- Content -->
    <div>
      <CongratsScreen />
    </div>
  </div>

  {/if}

</main>
