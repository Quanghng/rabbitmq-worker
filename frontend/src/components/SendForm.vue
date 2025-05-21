<template>
  <form @submit.prevent="sendOperation" class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col gap-4">
    <div class="flex flex-col md:flex-row gap-2">
      <input v-model.number="n1" type="number" placeholder="n1" class="border rounded-lg px-3 py-2 flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
      <input v-model.number="n2" type="number" placeholder="n2" class="border rounded-lg px-3 py-2 flex-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100" required />
      <select v-model="op" class="border rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100">
        <option value="add">Addition</option>
        <option value="sub">Soustraction</option>
        <option value="mul">Multiplication</option>
        <option value="div">Division</option>
        <option value="all">Toutes</option>
      </select>
    </div>
    <button
      type="submit"
      class="bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 transition disabled:opacity-50"
      :disabled="loading"
    >
      {{ loading ? "Envoi en cours..." : "Envoyer l'opération" }}
    </button>
    <span v-if="message" class="text-green-400 mt-2">{{ message }}</span>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const n1 = ref(0), n2 = ref(0), op = ref('add')
const message = ref('')
const loading = ref(false)
const sendOperation = async () => {
  loading.value = true
  try {
    const response = await fetch('http://localhost:3000/calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1: n1.value, n2: n2.value, op: op.value })
    })
    const data = await response.json()

    if (op.value === 'all') {
      message.value = data.map(item => `${item.op} : ${item.result}`).join('\n')
    } else {
      message.value = `Résultat : ${data[0]?.result ?? 'Erreur'}`
    }
  } catch (e) {
    message.value = "Erreur d'envoi"
  } finally {
    loading.value = false
  }
}
</script>
