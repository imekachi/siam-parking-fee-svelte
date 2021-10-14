<script lang="ts">
  import { Chart } from 'chart.js'
  import { onMount } from 'svelte'
  import { chartData, chartOptions } from '../config/chart'

  let chartElement: HTMLCanvasElement
  onMount(() => {
    new Chart(chartElement, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    })
  })
</script>

<div class="chart-container">
  <canvas bind:this={chartElement} height="280" />
</div>

<style>
  .chart-container {
    max-width: 600px;
    margin: 0 auto;
  }
</style>
