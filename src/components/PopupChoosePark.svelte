<script>
  import { parkConfigEntries } from '../config/park'
  import { fade, fly } from 'svelte/transition'

  export let onClickBackdrop
  export let onChoosePark
</script>

<div
  class="backdrop"
  on:click={onClickBackdrop}
  transition:fade={{ duration: 300 }}
/>
<section class="popup" transition:fly={{ y: 40, duration: 300 }}>
  <div class="popup-header">Where are you parking at?</div>
  <ul class="park-list">
    {#each parkConfigEntries as [parkId, parkInfo] (parkId)}
      <li
        class="park-list-item _prevent-selection"
        data-park-id={parkId}
        on:click={() => onChoosePark(parkInfo, parkId)}
      >
        {parkInfo.name}
      </li>
    {/each}
  </ul>
</section>

<style>
  .popup {
    position: fixed;
    z-index: 100;
    top: 50%;
    left: 24px;
    right: 24px;
    transform: translateY(-50%);
    background-color: #272727;
    padding: 24px;
    border-radius: var(--rounded-radius);
  }

  .backdrop {
    position: fixed;
    z-index: 90;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .popup-header {
    margin-bottom: 16px;
  }

  .park-list {
    padding: 0;
    margin: 0;
  }

  .park-list-item {
    list-style: none;
    padding: 16px;
    cursor: pointer;
  }

  .park-list-item:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: var(--rounded-radius);
  }
</style>
