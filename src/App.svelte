<script>
  import COLORS from './config/colors'
  import { onMount } from 'svelte'
  import Chart from 'chart.js'
  import { chartData, chartOptions } from './config/chart'
  import PopupChoosePark from './components/PopupChoosePark.svelte'
  import { calculateFee } from './functions/fee'

  let chartElement
  let chart
  let isChoosingPark = false
  let currentPark

  onMount(() => {
    chart = new Chart(chartElement, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    })
  })

  function onChoosePark(parkId, parkInfo) {
    // initialize currentDuration
    const currentDuration = 0.001
    // initialize currentFee
    const currentFee = calculateFee(parkInfo.feeRates, currentDuration)
    
    currentPark = {
      info: parkInfo,
      start: new Date(),
      durationHrs: currentDuration,
      fee: currentFee
    }
    isChoosingPark = false
  }
</script>

<main class="app">
  <h1 class="header">Bike parking fee</h1>
  <!-- Chart -->
  <div class="chart-container">
    <canvas bind:this={chartElement} height="280" />
  </div>

  <!-- <ParkInfo /> -->
  <button
    class="floating-button _prevent-selection"
    style="background-color: {COLORS.PURPLE}"
    on:click={() => (isChoosingPark = true)}
  >
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="parking"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      class="svg-inline--fa fa-parking fa-w-14"
      ><path
        fill="currentColor"
        d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM240 320h-48v48c0 8.8-7.2 16-16 16h-32c-8.8 0-16-7.2-16-16V144c0-8.8 7.2-16 16-16h96c52.9 0 96 43.1 96 96s-43.1 96-96 96zm0-128h-48v64h48c17.6 0 32-14.4 32-32s-14.4-32-32-32z"
        class=""
      /></svg
    > Park
  </button>

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
    color: #000;
    text-transform: uppercase;

    width: 128px;
    height: 60px;
    border-radius: 30px;
    border: 0 none;
    outline: 0 none;
    cursor: pointer;
  }

  .floating-button > .svg-inline--fa {
    margin-right: 6px;
  }

  ._prevent-selection {
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .svg-inline--fa.fa-w-14 {
    width: 0.875em;
  }
  .svg-inline--fa {
    display: inline-block;
    font-size: inherit;
    height: 1em;
    overflow: visible;
    vertical-align: -0.125em;
  }
</style>
