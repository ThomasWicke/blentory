<template>
  <div class="max-w-md mx-auto mt-10">
    <h1 class="text-xl font-bold mb-4">Login</h1>
    <form class="space-y-4" @submit.prevent="handleLogin">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        class="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
        required
      />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        class="w-full border border-gray-600 bg-gray-800 text-white p-2 rounded"
        required
      />
      <button type="submit" class="w-full bg-blue-600 text-white p-2 rounded">
        Login
      </button>
    </form>

    <p v-if="errorMessage" class="text-red-400 mt-4">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref(null)

const auth = useAuthStore()
const router = useRouter()

async function handleLogin() {
  errorMessage.value = null
  try {
    await auth.login(email.value, password.value)
    router.push('/') // Redirect to Inventory
  } catch (error) {
    errorMessage.value = error.message
  }
}
</script>

