<script>
  import link from '../assets/links-fill.svg'
  import trashBin from '../assets/delete-bin-line.svg'
  import add from '../assets/heart-add-line.svg'
  import setting from '../assets/settings.svg'
  import './collection.css'
  import localforage from 'localforage'
  import { onMount } from 'svelte'
  import Pagination from '../components/Pagination.svelte'
  import { pageNum } from '../lib/paginationStore'

  let collectedWords = []

  const getCollectedWords = () => {
    let _collectedWords = []

    //get all collected words
    localforage
      .iterate((value, key, iterationNumber) => {
        _collectedWords.push({ iterationNumber, key, value })
      })
      .then(() => {
        _collectedWords.sort((a, b) => b.value.timeStamp - a.value.timeStamp)
        collectedWords = _collectedWords
      })
  }

  const divideWordsIntoPages = (collectedWords, pageSize) => {
    let _wordsInPages = []

    for (let i = 0; i < collectedWords.length; i += pageSize) {
      let chunk = collectedWords.slice(i, i + pageSize)
      _wordsInPages.push(chunk)
    }

    return _wordsInPages
  }

  const jumpToURL = (currentURL) => {
    return () => {
      chrome.tabs.create({
        url: currentURL,
      })
    }
  }

  const removeWords = (selectedText) => {
    return () => {
      localforage.removeItem(selectedText).then(() => {
        getCollectedWords()
      })
    }
  }

  const openSidePanel = (selectedText) => {
    return () => {
      chrome.runtime.sendMessage({
        selectedText,
        from: 2, // open sidepanel from collection.html
      })
    }
  }

  onMount(() => {
    getCollectedWords()
  })

  $: wordsInPages = divideWordsIntoPages(collectedWords, 10)
</script>

<main class="flex flex-col px-8 pt-5">
  <div class=" flex justify-between items-center">
    <div class="text-[#677480] text-[20px]">
      已标记<span class="text-[#83D9F4] mx-1">{collectedWords.length}</span>个单词
    </div>
    <div class=" flex items-center">
      <!-- <button
        on:click={jumpToURL('https://www.jedxie.work/')}
        class="self-stretch flex items-stretch"
      >
        <div
          class=" px-3 bg-[#83D9F4] text-white font-medium mr-5 flex justify-center items-center rounded-md"
        >
          Buy me a coffee ☕️
        </div>
      </button> -->
      <a href="/options.html" target="_blank">
        <img src={setting} alt="settings" class=" w-7 h-7" />
      </a>
    </div>
  </div>
  <div class=" flex flex-col items-stretch divide-y divide-dashed divide-[#C5F1FF] mt-1">
    {#if wordsInPages.length > 0}
      {#each wordsInPages[$pageNum] as { value: { currentURL, selectedText, sentence } }}
        <div class=" flex group">
          <span
            class=" w-full px-2 flex justify-between items-center h-[8vh] rounded-md group-hover:bg-[#EBF8FF]"
          >
            <button on:click={openSidePanel(selectedText)} class=" flex text-left">
              <div class=" text-[#3B4349] text-[20px] font-[600] shrink-0">{selectedText}</div>
              <div class=" ml-6 text-[#677480] mt-1 text-[14px] line-clamp-2 grow">
                {@html sentence}
              </div>
            </button>
            <div class=" flex justify-center items-center shrink-0 ml-2">
              <button class=" invisible group-hover:visible" on:click={jumpToURL(currentURL)}>
                <img class=" h-5 w-5 mr-4" src={link} alt="link" />
              </button>
              <button class=" invisible group-hover:visible" on:click={removeWords(selectedText)}>
                <img class=" h-5 w-5" src={trashBin} alt="delete" />
              </button>
            </div>
          </span>
        </div>
      {/each}
    {:else}
      <div class="mt-60 flex flex-col items-center justify-center">
        <img src={add} alt="add" />
        <div class=" mt-2 text-[#677480] text-[18px]">尚未标记单词</div>
      </div>
    {/if}
  </div>
  <div class=" fixed left-0 right-0 bottom-10 flex justify-center">
    {#if wordsInPages.length > 0}
      <Pagination maxPage={wordsInPages.length}></Pagination>
    {/if}
  </div>
</main>
