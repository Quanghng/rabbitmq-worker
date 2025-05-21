<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
    <h2 class="font-semibold text-lg mb-4 text-gray-200">Résultats (Temps réel)</h2>
    <table class="w-full text-left text-sm">
      <thead>
        <tr class="text-gray-400">
          <th class="py-2">n1</th>
          <th class="py-2">Opération</th>
          <th class="py-2">n2</th>
          <th class="py-2">Résultat</th>
          <th class="py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(r, i) in results" :key="i" class="border-t border-gray-600">
          <td>{{ r.n1 }}</td>
          <td>{{ r.op }}</td>
          <td>{{ r.n2 }}</td>
          <td>{{ r.result }}</td>
          <td>{{ formatDate(r.timestamp) }}</td>
        </tr>
        <tr v-if="results.length === 0"><td colspan="5" class="text-center text-gray-300 py-3">Aucun résultat pour l’instant</td></tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
  const props = defineProps({
    results: {
      type: Array,
      default: () => []
    }
  })

  const formatDate = ts => ts ? new Date(ts).toLocaleTimeString() : ''
</script>
