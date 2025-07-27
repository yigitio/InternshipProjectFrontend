<template>
  <ul class="relation-list">
    <li v-for="rel in relations" :key="rel.relation_id" class="relation-item">
      <div>
        <span class="names"
          >{{ rel.mentorName }} <span class="swap-arrow">↔</span>
          {{ rel.internName }}</span
        >
      </div>
      <div class="actions">
        <button
          class="icon-btn delete-btn"
          @click="$emit('delete', rel.relation_id)"
          title="Sil"
        >
          Sil
        </button>
        <button
          class="icon-btn edit-btn"
          @click="$emit('edit', rel)"
          title="Düzenle"
        >
          Detay
        </button>
      </div>
    </li>
  </ul>
</template>
<script setup lang="ts">
import '@fortawesome/fontawesome-free/css/all.min.css';

defineProps<{
  relations: any[];
}>();
defineEmits(['delete', 'edit']);
</script>

<style scoped>
.relation-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.relation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #35365c;
  margin-bottom: 12px;
  border-radius: 10px;
  border-left: 6px solid #f58220;
  box-shadow: 0 2px 8px rgba(245, 130, 32, 0.08);
  transition: box-shadow 0.2s, border-color 0.2s;
  padding: 10px 18px;
}
.relation-item:hover {
  box-shadow: 0 4px 16px rgba(245, 130, 32, 0.18);
  border-left: 8px solid #f58220;
}
.names {
  color: #f9f6e8;
  font-size: 17px;
  font-weight: 500;
}
.swap-arrow {
  color: #f58220;
  font-size: 20px;
  margin: 0 5px;
}
.actions {
  display: flex;
  gap: 8px;
}
.icon-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: bold;
  padding: 6px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.delete-btn {
  background: #e53935;
  color: #fff;
}
.delete-btn:hover {
  background: #f58220;
  color: #242441;
}
.edit-btn {
  background: #fff;
  color: #242441;
  border: 1.5px solid #f58220;
}
.edit-btn:hover {
  background: #f58220;
  color: #fff;
}
</style>
