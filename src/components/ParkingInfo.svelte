<script lang="ts">
  import { onDestroy } from 'svelte'
  import COLORS from '../config/colors'
  import { FeeRate, parkConfig } from '../config/park'
  import { calculateFee } from '../functions/fee'
  import { formatDuration, getDuration, msToHrs } from '../utils/time'

  export let isLive = false
  export let parkId: string
  export let start: Date
  export let onClickLiveButton: (event: MouseEvent) => void

  let name: string
  let color: string
  let duration: number
  let feeRates: FeeRate[]
  let fee: number
  
  function updateDurationAndFee() {
    duration = getDuration(start)
    fee = calculateFee(feeRates, msToHrs(duration)) 
  }
  
  $: {
    const parkInfo = parkConfig[parkId]
    name = parkInfo.name
    color = parkInfo.color
    feeRates = parkInfo.feeRates
    updateDurationAndFee()
  }

  let timeoutId: number
  $: if (isLive) {
    timeoutId = window.setTimeout(updateDurationAndFee, 1000)
  } else {
    clearTimeout(timeoutId)
  }
  onDestroy(() => {
    clearTimeout(timeoutId)
  })
</script>

<div class="container">
  <button class="live-button" class:-live={isLive} on:click|preventDefault={onClickLiveButton}>
    LIVE
  </button>
  <h2 class="park-title" style="color: {color};">{name}</h2>
  <div class="park-info-field">
    <span class="label">Check-in:</span>
    <span class="value">{start.toLocaleString()}</span>
  </div>
  <div class="park-info-field">
    <span class="label">Duration:</span>
    <span class="value">{formatDuration(duration)}</span>
  </div>
  <hr class="separator" />
  <div class="park-info-field -summary">
    <span class="label">Total:</span>
    <span class="value" style="color: {COLORS.GREEN};">
      {fee.toLocaleString('en-TH', {
        style: 'currency',
        currency: 'THB',
      })}
    </span>
  </div>
</div>

<style>
  .container {
    position: relative;
    background-color: #1d1d1d;
    margin-top: 12px;
    padding: 24px;
    border-radius: var(--rounded-radius);
  }

  .live-button {
    position: absolute;
    top: 30px;
    right: 24px;
    width: 42px;
    height: 18px;
    font-size: 10px;
    background-color: #636363;
    color: #ffffff;
    border-radius: 10px;
    box-shadow: none;
    border: 0 none;
    outline: 0 none;
    opacity: 0.6;
    cursor: pointer;
  }

  @keyframes pulse {
    0% {
      background-color: #ff4a48;
    }
    50% {
      background-color: #9c3333;
    }
    100% {
      background-color: #ff4a48;
    }
  }

  .live-button.-live {
    opacity: 1;
    animation: pulse 1s infinite ease-in-out;
  }

  .park-title {
    margin: 0 0 12px;
    font-size: 21px;
    text-align: left;
  }

  .park-info-field:not(:last-child) {
    margin-bottom: 8px;
  }

  .park-info-field > .label {
    display: inline-block;
    vertical-align: baseline;
    min-width: 72px;
  }

  .park-info-field > .value {
    font-weight: 700;
  }

  .separator {
    margin: 24px 0;
    border: solid rgba(255, 255, 255, 0.2);
    border-width: 0 0 1px 0;
  }

  .park-info-field.-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .park-info-field.-summary > .value {
    font-size: 21px;
    font-weight: 700;
    text-align: right;
  }
</style>
