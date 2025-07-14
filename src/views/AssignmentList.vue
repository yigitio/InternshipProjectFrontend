<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
  fetchAssignments,
  deleteAssignment,
  type Assignment,
} from '@/utils/assignmentService';

const assignments = ref<Assignment[]>([]);

const loadAssignments = async () => {
  assignments.value = await fetchAssignments();
};

const removeAssignment = async (id: number) => {
  await deleteAssignment(id);
  await loadAssignments();
};

onMounted(() => {
  loadAssignments();
});
</script>

<template>
  <div>
    <h2>📋 Atanan Görevler</h2>
    <ul>
      <li v-for="item in assignments" :key="item.id">
        {{ item.assignmentDesc }}
        <button @click="removeAssignment(item.id)">Sil</button>
      </li>
    </ul>
  </div>
</template>
