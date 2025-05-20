<template>
  <div class="min-h-screen bg-gray-900 flex flex-col items-center py-8">
    <h1 class="text-3xl font-bold mb-8 text-white drop-shadow">🧠 Calcul Distribué RabbitMQ</h1>
    <div class="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
      <div class="flex-1 flex flex-col gap-8">
        <SendForm />
        <AutoSender />
        <ResultList />
      </div>
      <AdminPanel class="flex-1" />
    </div>
    <footer class="mt-12 text-gray-300 text-sm">Projet RabbitMQ – Vue.js + Tailwind CDN • Lolo & co</footer>
  </div>
</template>
<style>
td{
  color: white !important;
}
</style>
<script setup>
import SendForm from './components/SendForm.vue'
import AutoSender from './components/AutoSender.vue'
import ResultList from './components/ResultList.vue'
import AdminPanel from './components/AdminPanel.vue'
</script>
