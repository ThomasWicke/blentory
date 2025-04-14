<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow p-4">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()

onMounted(() => {
  auth.fetchUser()
})
</script>
