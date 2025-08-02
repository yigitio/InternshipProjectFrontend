<template>
  <div style="width: 100%; display: flex; justify-content: center">
    <canvas ref="canvas" style="max-width: 250px; max-height: 250px" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { defineProps } from 'vue';
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
import { useI18n } from 'vue-i18n';

Chart.register(PieController, ArcElement, Tooltip, Legend);

const props = defineProps<{ data: { name: string; value: number }[] }>();
const canvas = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const { t } = useI18n();

// Backend Türkçe gönderdiği için mapping yapıyoruz
const LABEL_KEY_MAP: Record<string, string> = {
  Yapıldı: 'done',
  Yapılmadı: 'notDone',
};

const COLOR_MAP: Record<string, string> = {
  done: '#242441',
  notDone: '#f58220',
};

const renderChart = () => {
  if (!canvas.value) return;

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(canvas.value, {
    type: 'pie',
    data: {
      labels: props.data.map(d => t(`pie.${LABEL_KEY_MAP[d.name] || d.name}`)),
      datasets: [
        {
          data: props.data.map(d => d.value),
          backgroundColor: props.data.map(
            d => COLOR_MAP[LABEL_KEY_MAP[d.name] || d.name] || '#ccc'
          ),
          borderColor: '#ffffff',
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
