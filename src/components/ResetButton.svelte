<script>
  import COLORS from '../config/colors'
  import IconTrash from './IconTrash.svelte'
</script>

<button
  class="floating-button _prevent-selection"
  style="background-color: {COLORS.YELLOW}"
  on:click|preventDefault
>
  <IconTrash />
  Reset
</button>
