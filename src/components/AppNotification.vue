/* global defineProps */
<template>
  <transition name="fade">
    <div v-if="visible" :class="['notification', type]">
      {{ message }}
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  message: { type: String, required: true },
  type: { type: String, default: 'info' }, // 'success', 'error', 'info'
  show: { type: Boolean, default: false },
  duration: { type: Number, default: 2500 },
});

const visible = ref(props.show);

watch(
  () => props.show,
  val => {
    visible.value = val;
    if (val) {
      setTimeout(() => {
        visible.value = false;
      }, props.duration);
    }
  }
);
</script>

<style scoped>
.notification {
  position: fixed;
  top: 32px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 220px;
  max-width: 90vw;
  padding: 16px 32px;
  border-radius: 8px;
  color: #fff;
  font-weight: 600;
  font-size: 1.1rem;
  z-index: 9999;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.18);
  text-align: center;
  opacity: 0.98;
}
.notification.success {
  background: #f58220;
  color: #242441;
}
.notification.error {
  background: #e53935;
}
.notification.info {
  background: #242441;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
