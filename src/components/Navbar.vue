<template>
  <nav class="bg-gray-900 text-white px-4 py-3 flex justify-between items-center">
    <RouterLink to="/" class="font-bold text-lg" style="color: #FFFFFF; text-decoration: none;">Blentory</RouterLink>
    <div class="flex items-center gap-6">
      <template v-if="!auth.user">
        <RouterLink to="/login" class="hover:underline">Login</RouterLink>
        <RouterLink to="/register" class="hover:underline">Register</RouterLink>
      </template>
    </div>
    <RouterLink
    v-if="auth.role === 'admin'"
    to="/add"
    class="px-3 py-1"
    style="text-decoration: none;"
  >
    + Add Item
  </RouterLink>

    <div class="flex items-center gap-4 text-sm text-gray-400" v-if="auth.user">
      <span>{{ auth.user.email }}</span>
      <button @click="handleLogout" class="text-red-400 hover:text-red-300">Logout</button>
    </div>
  </nav>
</template>


<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}

</script>
