<script>
  import { onMount } from 'svelte'
  import { supabse } from '../lib/supabase'
  import { translationHandler } from '../lib/translationHandler'
  import localforage from 'localforage'

  import heart_line from '../assets/heart-line.svg'
  import heart_fill from '../assets/heart-fill.svg'
  import loudspeaker from '../assets/volume-up-fill.svg'
  import book from '../assets/book-mark-line.svg'

  let selectedWordInfo = undefined
  let translation = null
  let audioSrc = ''
  let isCollected = false
  let totalCollectionNum = 0
  let callFrom = 1

  const getTranslation = (selectedWordInfo) => {
    if (selectedWordInfo) {
      supabse
        .from('dictionary')
        .select()
        .eq('word', selectedWordInfo.selectedText)
        .then((res) => {
          if (res.data.length > 0) {
            translation = translationHandler(res.data[0])
          } else {
            translation = 'no result'
          }
        })
    }
  }

  const getAudioSrc = (translation) => {
    if (translation && translation != 'no result') {
      audioSrc = 'http://dict.youdao.com/dictvoice?type=0&audio=' + translation.word
    }
  }

  const getTotalCollectionNum = () => {
    localforage.length().then((res) => {
      totalCollectionNum = res
    })
  }

  const openCollection = () => {
    chrome.tabs.create({
      url: 'collection.html',
    })
  }

  const checkCollection = (translation) => {
    if (translation && translation != 'no result') {
      localforage.getItem(translation.word).then((res) => {
        if (res) {
          isCollected = true
        } else {
          isCollected = false
        }
      })
    }
  }

  const collectWord = () => {
    selectedWordInfo.timeStamp = Date.now()
    localforage.setItem(translation.word, selectedWordInfo).then(() => {
      isCollected = true
      getTotalCollectionNum()
    })
  }

  const removeCollectedWord = () => {
    localforage.removeItem(translation.word).then(() => {
      isCollected = false
      getTotalCollectionNum()
    })
  }

  onMount(() => {
    //get the selectedTextInfo as soon as the side panel has been opened.(initially)
    chrome.storage.session.get(['selectedTextInfo']).then(({ selectedTextInfo }) => {
      selectedWordInfo = selectedTextInfo
      callFrom = selectedTextInfo.from
    })

    //get the new selectedTextInfo value when the selectedTextInfo has been changed.
    chrome.storage.onChanged.addListener(({ selectedTextInfo: { newValue } }) => {
      selectedWordInfo = newValue
      callFrom = newValue.from
    })

    getTotalCollectionNum()
  })

  //get the translation via API as long as selectedWordInfo has been changed.
  $: getTranslation(selectedWordInfo)

  //make a new audio URL if translation has been changed besides the value of translation is not undefined or "no result".
  $: getAudioSrc(translation)

  //check if the word has been collected.
  $: checkCollection(translation)
</script>

<main class=" flex flex-col items-stretch p-3">
  {#if translation && translation != 'no result'}
    <!-- normal state -->
    <div class="flex flex-col items-stretch divide-y divide-dashed divide-[#C5F1FF]">
      <div class=" flex flex-col items-stretch">
        <div class=" flex justify-between items-center">
          <div class="text-[30px] text-[#3B4349] font-[600]">{translation.word}</div>
          {#if callFrom === 1}
            <button on:click={isCollected ? removeCollectedWord : collectWord}>
              <img
                class=" w-7 h-7"
                src={isCollected ? heart_fill : heart_line}
                alt="add to collection"
              />
            </button>
          {/if}
        </div>
        <div class=" flex items-center">
          {#if translation.phonetic}
            <div class=" text-[18px] text-[#83D9F4]">{`/ ${translation.phonetic} /`}</div>
          {/if}
          <button
            on:click={() => {
              let player = document.getElementById('audioPlayer')
              player.play()
            }}
          >
            <img class=" w-6 h-6 ml-2" src={loudspeaker} alt="read aloud" />
          </button>
          <audio autoplay id="audioPlayer" src={audioSrc} />
        </div>
      </div>

      <div class=" flex flex-col items-stretch mt-2">
        {#each translation.translation as item}
          <div class="flex items-start text-[16px] first:mt-2">
            {#if item[0]}
              <div class=" text-[#83D9F4] mr-2">{`${item[0]}.`}</div>
            {/if}
            <div class="text-[#677480]">{item[1]}</div>
          </div>
        {/each}
      </div>

      {#if translation.exchange}
        <div class=" flex flex-col items-stretch mt-2">
          {#each translation.exchange as item}
            {#if item[0]}
              <div class="flex items-center text-[16px] first:mt-2">
                <div class=" text-[#83D9F4] text-[14px] mr-2">{item[0]}</div>
                <div class=" text-[#677480]">{item[1]}</div>
              </div>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  {:else if translation && translation === 'no result'}
    <!-- no translation been found -->
    <div class=" h-28 flex justify-center items-center text-[#B3C0CC]">
      {@html `抱歉，未找到 <span style="color:#83D9F4;margin:2px;">${selectedWordInfo.selectedText}</span> 的释义`}
    </div>
  {:else}
    <!-- no word been selected (initial state) -->
    <div class=" h-28 flex justify-center items-center text-[#B3C0CC]">
      请在网页中选中需要翻译的单词
    </div>
  {/if}

  <!-- collection entrance -->
  {#if callFrom === 1}
    <button on:click={openCollection}>
      <div
        class=" fixed bottom-3 left-3 right-3 h-10 rounded-lg flex justify-between items-center px-2 bg-[#83D9F4] hover:bg-[#65CDEE]"
      >
        <div class="flex items-center">
          <img class=" w-5 h-5 mr-2" src={book} alt="collection" />
          <div class=" text-white text-[16px]">单词本</div>
        </div>
        <div class=" text-white text-[14px]">{totalCollectionNum}</div>
      </div>
    </button>
  {/if}
</main>
