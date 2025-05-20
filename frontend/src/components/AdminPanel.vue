<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 h-full flex flex-col gap-4">
    <h2 class="font-semibold text-lg mb-4 text-gray-200">Admin Panel</h2>
    <div class="flex flex-col gap-2">
      <div class="flex justify-between items-center">
        <span class="font-medium text-gray-400">Total Workers actifs :</span>
        <span class="text-lg font-bold text-indigo-400">{{ workers.length }}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="font-medium text-gray-400">Total opérations traitées :</span>
        <span class="text-lg font-bold text-green-400">{{ totalOps }}</span>
      </div>
    </div>
    <table class="w-full text-left text-sm mt-4">
      <thead>
        <tr class="text-gray-400">
          <th>Type</th>
          <th>Status</th>
          <th>Traitées</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in workers" :key="w.id">
          <td class="capitalize">{{ w.type }}</td>
          <td>
            <span :class="w.status === 'idle' ? 'text-green-400' : 'text-blue-400'">{{ w.status }}</span>
          </td>
          <td>{{ w.count }}</td>
          <td>
            <button class="bg-red-500 px-2 rounded text-white" @click="stopWorker(w.id)">Arrêter</button>
          </td>
        </tr>
        <tr v-if="workers.length === 0"><td colspan="4" class="text-center text-gray-300 py-2">Aucun worker actif</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
// Mock, à remplacer par WS d’admin
const workers = ref([
  { id: 1, type: 'add', status: 'idle', count: 12 },
  { id: 2, type: 'sub', status: 'busy', count: 7 },
  { id: 3, type: 'mul', status: 'idle', count: 10 },
  { id: 4, type: 'div', status: 'idle', count: 9 },
])
const stopWorker = id => alert("Arrêt du worker " + id + " (pas branché)")
const totalOps = computed(() => workers.value.reduce((acc, w) => acc + w.count, 0))
onMounted(() => {
  // Pour plus tard : brancher WS admin
})
</script>
