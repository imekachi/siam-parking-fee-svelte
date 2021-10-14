<script lang="ts">
  import { onMount } from 'svelte'
  import FeeChart from './components/FeeChart.svelte'
  import ParkButton from './components/ParkButton.svelte'
  import ParkingInfo from './components/ParkingInfo.svelte'
  import PopupChoosePark from './components/PopupChoosePark.svelte'
  import ResetButton from './components/ResetButton.svelte'
  import { storage } from './functions/fee'

  interface CurrentParkState {
    parkId: string
    start: Date
  }

  let isChoosingPark = false
  let currentPark: CurrentParkState | undefined
  let isLive = false

  onMount(() => {
    // Get data from storage and populate into local state
    const { start, parkId, isLive: storageIsLive } = storage.getData()
    if (!start || !parkId) return undefined

    isLive = storageIsLive
    currentPark = { parkId, start }
  })

  function onChoosePark(parkId: string) {
    const newParkingInfo = { parkId, start: new Date() }
    // store it to storage
    storage.store({ start: newParkingInfo.start, parkId })
    // update the state
    currentPark = newParkingInfo
    // close the popup
    isChoosingPark = false
  }

  function onResetPark() {
    // reset storage
    storage.reset()
    // preserve isLive in storage
    storage.store({ isLive })
    currentPark = undefined
  }

  function onClickLiveButton() {
    isLive = !isLive
    storage.store({ isLive })
  }
</script>

<main class="app">
  <h1 class="header">Bike parking fee</h1>
  <FeeChart />

  {#if currentPark}
    <ParkingInfo
      {isLive}
      parkId={currentPark.parkId}
      start={currentPark.start}
      {onClickLiveButton}
    />
    <ResetButton on:click={onResetPark} />
  {:else}
    <ParkButton on:click={() => (isChoosingPark = true)} />
  {/if}

  {#if isChoosingPark}
    <PopupChoosePark
      {onChoosePark}
      onClickBackdrop={() => (isChoosingPark = false)}
    />
  {/if}
</main>

<style>
  .header {
    font-size: 21px;
    text-align: center;
    margin: 0 0 24px;
  }
</style>
