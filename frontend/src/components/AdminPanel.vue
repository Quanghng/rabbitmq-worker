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
    <table class="w-full text-center text-sm ml-3">
      <thead>
        <tr class="text-gray-400">
          <th>Type</th>
          <th>Status</th>
          <th>Traitées</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="w in workers" :key="w.id">
          <td class="capitalize">{{ w.type }}</td>
          <td>
            <span :class="w.up ? (w.status === 'idle' ? 'text-green-400' : 'text-blue-400') : 'text-red-400'">
              {{ w.up ? w.status : 'offline' }}
            </span>
          </td>
          <td>{{ w.count }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue'

  const workers = ref([])
  const totalOps = computed(() => workers.value.reduce((acc, w) => acc + w.count, 0))

  async function fetchWorkers() {
    const res = await fetch('http://localhost:3000/workers')
    const data = await res.json()
    workers.value = data
  }

  onMounted(() => {
    fetchWorkers()
    setInterval(fetchWorkers, 5000)
  })
</script>
