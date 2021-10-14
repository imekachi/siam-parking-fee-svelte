<script>
  import COLORS from '../config/colors'
  import IconPark from './IconPark.svelte'
</script>

<button
  class="floating-button _prevent-selection"
  style="background-color: {COLORS.PURPLE}"
  on:click|preventDefault
>
  <IconPark />
  Park
</button>
