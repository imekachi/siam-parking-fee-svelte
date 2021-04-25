<script lang="ts">
  import Chart from 'chart.js'
  import { onDestroy, onMount } from 'svelte'
  import IconPark from './components/IconPark.svelte'
  import IconTrash from './components/IconTrash.svelte'
  import ParkingInfo from './components/ParkingInfo.svelte'
  import PopupChoosePark from './components/PopupChoosePark.svelte'
  import { chartData, chartOptions } from './config/chart'
  import COLORS from './config/colors'
  import type { ParkID, ParkInfo } from './config/park'
  import { parkConfig } from './config/park'
  import { calculateFee, storage } from './functions/fee'
  import { getDurationHrs } from './utils/time'

  interface CurrentParkState {
    info: ParkInfo
    start: Date
    durationHrs: number
    fee: number
  }

  let chartElement: HTMLCanvasElement
  let isChoosingPark = false
  let currentPark: CurrentParkState | undefined
  let isLive = false
  let liveIntervalId: number

  function updateDuration() {
    if (!currentPark) return undefined
    const currentDuration = getDurationHrs(currentPark.start)
    currentPark = {
      ...currentPark,
      durationHrs: currentDuration,
      fee: calculateFee(currentPark.info.feeRates, currentDuration),
    }
  }

  function handleLiveUpdate() {
    // clear existing interval before staring a new one
    clearInterval(liveIntervalId)

    if (isLive) {
      liveIntervalId = setInterval(updateDuration, 1000)
    }
  }

  onMount(() => {
    // Get data from storage and populate into local state
    const storageData = storage.getData()
    if (storageData?.parkId && storageData.start) {
      const parkInfo = parkConfig[storageData.parkId as ParkID]

      if (parkInfo) {
        const currentDuration = getDurationHrs(storageData.start)
        isLive = !!storageData.isLive
        currentPark = {
          info: parkInfo,
          start: storageData.start,
          durationHrs: currentDuration,
          fee: calculateFee(parkInfo.feeRates, currentDuration),
        }

        handleLiveUpdate()
      }
    }

    new Chart(chartElement, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    })
  })

  onDestroy(() => {
    clearInterval(liveIntervalId)
  })

  function onChoosePark(parkInfo: ParkInfo, parkId: ParkID) {
    // initialize currentDuration
    const currentDuration = 0.001
    // initialize currentFee
    const currentFee = calculateFee(parkInfo.feeRates, currentDuration)

    currentPark = {
      info: parkInfo,
      start: new Date(),
      durationHrs: currentDuration,
      fee: currentFee,
    }
    storage.store({ start: currentPark.start, parkId })
    isChoosingPark = false

    handleLiveUpdate()
  }

  function onResetPark() {
    currentPark = undefined
    // reset storage
    storage.reset()
    // stop live update interval
    clearInterval(liveIntervalId)
    // preserve isLive in storage
    storage.store({ isLive })
  }

  function onClickLiveButton() {
    isLive = !isLive
    storage.store({ isLive })
    handleLiveUpdate()
  }
</script>

<main class="app">
  <h1 class="header">Bike parking fee</h1>
  <!-- Chart -->
  <div class="chart-container">
    <canvas bind:this={chartElement} height="280" />
  </div>

  {#if currentPark}
    <ParkingInfo
      {isLive}
      parkInfo={currentPark.info}
      start={currentPark.start}
      durationHrs={currentPark.durationHrs}
      fee={currentPark.fee}
      {onClickLiveButton}
    />
    <button
      class="floating-button _prevent-selection"
      style="background-color: {COLORS.YELLOW}"
      on:click={onResetPark}
    >
      <IconTrash />
      Reset
    </button>
  {:else}
    <button
      class="floating-button _prevent-selection"
      style="background-color: {COLORS.PURPLE}"
      on:click={() => (isChoosingPark = true)}
    >
      <IconPark />
      Park
    </button>
  {/if}

  {#if isChoosingPark}
    <PopupChoosePark
      onClickBackdrop={() => (isChoosingPark = false)}
      {onChoosePark}
    />
  {/if}
</main>

<style>
  :root {
    --radius: 3px;
  }

  .header {
    font-size: 21px;
    text-align: center;
    margin: 0 0 24px;
  }

  .chart-container {
    max-width: 600px;
    margin: 0 auto;
  }

  .floating-button {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 60px;
    z-index: 10;

    margin: auto;
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 18px;
    font-weight: bold;
    line-height: 1;
    color: #000000;
    text-transform: uppercase;

    width: 128px;
    height: 60px;
    border-radius: 30px;
    border: 0 none;
    outline: 0 none;
    cursor: pointer;
  }

  ._prevent-selection {
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
</style>
