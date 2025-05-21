<template>
    <div class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md flex flex-col gap-3 mt-3">
      <div class="flex flex-col md:flex-row gap-3 md:items-center">
        <span class="text-white dark:text-gray-200 font-semibold">Mode automatique :</span>
        <button @click="toggleAuto" class="rounded-lg px-4 py-2"
          :class="autoOn ? 'bg-red-500 text-white' : 'bg-green-600 text-white'">
          {{ autoOn ? "Arrêter" : "Démarrer" }}
        </button>
        <span v-if="autoOn" class="text-sm text-indigo-400 ml-2">Envoi automatique d'opérations toutes les {{ intervalSec }}s</span>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onUnmounted} from 'vue'
  const autoOn = ref(false)
  const intervalSec = 5
  
  const operations = ['add', 'sub', 'mul', 'div', 'all']
  
  let timer = null
  
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  function sendRandomOp() {
    const n1 = getRandomInt(1, 50)
    const n2 = getRandomInt(1, 50)
    const op = operations[getRandomInt(0, operations.length - 1)]
    fetch('http://localhost:3000/calc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1, n2, op })
    })
    .then(res => res.json())
    .then(data => {
      emit('new-result', data)
    })
  };

  const emit = defineEmits(['new-result']);

  const toggleAuto = () => {
    autoOn.value = !autoOn.value
    if (autoOn.value) {
      sendRandomOp()
      timer = setInterval(sendRandomOp, intervalSec * 1000)
    } else {
      clearInterval(timer)
    }
  };

  onUnmounted(() => {
    clearInterval(timer)
  })

  </script>
  