<script>
  const url = 'https://www.thoughtco.com/how-to-improve-your-english-1210369'
  const jumpToExamplePage = () => {
    chrome.tabs.update({
      url,
    })
  }
</script>

<div class=" w-full h-screen flex flex-col items-center justify-center select-none">
  <div class=" text-[40px] text-[#3B4349]">
    你好，欢迎使用<span class=" text-[#83D9F4] ml-2 font-semibold">Transider</span>
  </div>
  <span class="text-[#B3C0CC] text-[18px] font-light mt-4 flex flex-col items-center">
    <p>这是一个可以在浏览网站的同时随手记单词的学习工具</p>
    <p class="mt-1">
      只需鼠标<spna class="text-[#83D9F4] mx-1 font-semibold">双击</spna
      >页面中的单词，即可翻译和标记
    </p>
  </span>
  <button
    class=" px-20 py-3 bg-[#83D9F4] text-white rounded-lg mt-20 hover:bg-[#65CDEE] text-[18px]"
    on:click={jumpToExamplePage}>去试试</button
  >
</div>
