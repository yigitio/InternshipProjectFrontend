<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <canvas ref="canvas" style="max-width: 250px; max-height: 250px" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { defineProps } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const props = defineProps<{ data: { name: string; value: number }[] }>();
const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const renderChart = () => {
  if (!canvas.value) return;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(canvas.value, {
    type: 'pie',
    data: {
      labels: props.data.map(d => d.name),
      datasets: [
        {
          data: props.data.map(d => d.value),
          backgroundColor: ['#f58220', '#242441', '#8884d8', '#FFBB28'],
          borderColor: '#ffffff', // Beyaz çerçeve
          borderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      layout: {
        padding: 10,
      },
      animation: {
        animateRotate: true,
        animateScale: true,
      },
    },
  });
};

onMounted(renderChart);
watch(() => props.data, renderChart, { deep: true });
</script>
