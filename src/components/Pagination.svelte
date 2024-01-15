<script>
  import arrow_left from '../assets/arrow-left-s-line.svg'
  import arrow_right from '../assets/arrow-right-s-line.svg'
  import skip_left from '../assets/skip-left-line.svg'
  import skip_right from '../assets/skip-right-line.svg'
  import { pageNum } from '../lib/paginationStore'
  export let maxPage

  const next = () => {
    if ($pageNum < maxPage - 1) {
      pageNum.update((n) => n + 1)
    }
  }
  const previous = () => {
    if ($pageNum > 0) {
      pageNum.update((n) => n - 1)
    }
  }
  const reset = () => {
    pageNum.set(0)
  }
  const toLast = () => {
    pageNum.set(maxPage - 1)
  }
</script>

<div class=" flex items-center select-none">
  <button on:click={reset}><img src={skip_left} alt="skip_left" /></button>
  <button on:click={previous}><img src={arrow_left} alt="arrow_left" /></button>

  <div class=" flex items-center text-[20px] font-semibold">
    <div class="text-[#83D9F4] ml-2">{$pageNum + 1}</div>
    <div class="text-[#677480] mx-2">/</div>
    <div class="text-[#677480] mr-2">{maxPage}</div>
  </div>
  <button on:click={next}><img src={arrow_right} alt="arrow_right" /></button>
  <button on:click={toLast}><img src={skip_right} alt="skip_right" /></button>
</div>
