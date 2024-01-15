<script>
  import { onMount } from 'svelte'
  import pic1 from '../assets/pic1.svg'
  import pic2 from '../assets/pic2.svg'
  import link from '../assets/link.svg'

  let autoCollect = false //if auto save is on.
  let silentTranslate = false //play pronunciation automatically.
  let pauseExtension = false //pause the extension or not.

  onMount(() => {
    //get settings initially
    chrome.storage.session.get('autoCollect').then((res) => {
      if (res?.autoCollect) {
        autoCollect = res?.autoCollect
      }
    })
    chrome.storage.session.get('silentTranslate').then((res) => {
      if (res?.silentTranslate) {
        silentTranslate = res?.silentTranslate
      }
    })
    chrome.storage.session.get('pauseExtension').then((res) => {
      if (res?.pauseExtension) {
        pauseExtension = res?.pauseExtension
      }
    })

    // listener to monitor settings change
    chrome.storage.onChanged.addListener((res) => {
      if (res?.autoCollect) {
        autoCollect = res?.autoCollect.newValue
      } else if (res?.silentTranslate) {
        silentTranslate = res?.silentTranslate.newValue
      } else if (res?.pauseExtension) {
        pauseExtension = res?.pauseExtension.newValue
      }
    })
  })

  function setStorage(sessionName, value) {
    chrome.storage.session.set({ [sessionName]: value })
  }
</script>

<main class="flex flex-col px-8 pt-5 select-none">
  <div class="text-[#677480] text-[30px]">设置</div>
  <div class=" flex flex-col items-stretch mt-6 px-14 gap-y-8">
    <div class=" flex items-start">
      <button
        on:click={() => {
          setStorage('autoCollect', !autoCollect)
        }}
      >
        {#if autoCollect}
          <div
            class=" w-5 h-5 border-2 border-[#83D9F4] rounded-full mt-1 flex justify-center items-center"
          >
            <div class=" w-3 h-3 bg-[#83D9F4] rounded-full"></div>
          </div>
        {:else}
          <div class=" w-5 h-5 border-2 border-[#B3C0CC] rounded-full mt-1"></div>
        {/if}
      </button>
      <div class=" ml-3 flex flex-col">
        <div class=" text-[#677480] text-[18px] font-medium">自动标记单词</div>
        <div class="text-[#B3C0CC] text-[14px]">勾选后，所翻译的单词将自动存入单词本。</div>
      </div>
    </div>
    <div class=" flex items-start">
      <button
        on:click={() => {
          setStorage('silentTranslate', !silentTranslate)
        }}
      >
        {#if silentTranslate}
          <div
            class=" w-5 h-5 border-2 border-[#83D9F4] rounded-full mt-1 flex justify-center items-center"
          >
            <div class=" w-3 h-3 bg-[#83D9F4] rounded-full"></div>
          </div>
        {:else}
          <div class=" w-5 h-5 border-2 border-[#B3C0CC] rounded-full mt-1"></div>
        {/if}
      </button>
      <div class=" ml-3 flex flex-col">
        <div class=" text-[#677480] text-[18px] font-medium">静音翻译</div>
        <div class="text-[#B3C0CC] text-[14px]">勾选后，将不再自动播放单词的读音。</div>
      </div>
    </div>
    <div class=" flex items-start">
      <button
        on:click={() => {
          setStorage('pauseExtension', !pauseExtension)
        }}
      >
        {#if pauseExtension}
          <div
            class=" w-5 h-5 border-2 border-[#83D9F4] rounded-full mt-1 flex justify-center items-center"
          >
            <div class=" w-3 h-3 bg-[#83D9F4] rounded-full"></div>
          </div>
        {:else}
          <div class=" w-5 h-5 border-2 border-[#B3C0CC] rounded-full mt-1"></div>
        {/if}
      </button>
      <div class=" ml-3 flex flex-col">
        <div class=" text-[#677480] text-[18px] font-medium">停用侧边栏</div>
        <div class="text-[#B3C0CC] text-[14px]">
          勾选后，本插件将暂停运行，双击单词将不再弹出侧边栏。
        </div>
        <div class="text-[#B3C0CC] text-[14px]">
          如果想重新启用，请手动打开侧边栏，取消勾选该选项。
        </div>
        <div class=" flex mt-5 gap-x-10">
          <div class=" flex flex-col w-64">
            <img src={pic1} alt="pic1" class=" w-full" />
            <div class="flex mt-2">
              <div
                class=" w-4 h-4 rounded-full bg-[#83D9F4] text-white flex justify-center items-center mt-[2px] flex-shrink-0"
              >
                1
              </div>
              <div class=" text-[#B3C0CC] ml-1 text-[14px]">
                点击浏览器（右上角）地址栏右侧的“拼图”图标
              </div>
            </div>
          </div>
          <div class=" flex flex-col w-64">
            <img src={pic2} alt="pic2" class=" w-full" />
            <div class="flex mt-2">
              <div
                class=" w-4 h-4 rounded-full bg-[#83D9F4] text-white flex justify-center items-center mt-[2px] flex-shrink-0"
              >
                2
              </div>
              <div class=" text-[#B3C0CC] ml-1 text-[14px]">
                在弹出的插件列表中点击transider插件即可手动打开侧边栏
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center text-[16px] text-[#B3C0CC] italic">
      <div>{`更多好用产品 > 欢迎逛逛开发者的赛博地摊`}</div>
      <a class="flex items-center" href="https://www.jedxie.work/" target="_blank">
        <div class="text-[#83D9F4] font-semibold ml-2">www.jedxie.work</div>
        <img src={link} alt="link" class=" scale-75" />
      </a>
    </div>
  </div>
</main>
