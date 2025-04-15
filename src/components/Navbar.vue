<template>
  <nav class="bg-gray-900 text-white px-4 py-1 flex justify-between items-center">
    <!-- Left Group: Logo -->
    <div>
      <RouterLink to="/" class="font-bold text-lg" style="color: #FFFFFF; text-decoration: none;">
        Blentory
      </RouterLink>
    </div>

    <!-- Center Group: Conditional Buttons -->
    <div class="flex items-center">
      <RouterLink
        v-if="hasSelectedItems && route.path === '/'"
        to="/checkout"
        class="px-3 py-1"
        style="text-decoration: none;"
      >
        Checkout
      </RouterLink>

      <RouterLink
        v-if="auth.role === 'admin' && (route.path === '/add' || route.path === '/checkout')"
        to="/"
        class="px-3 py-1"
        style="text-decoration: none;"
      >
        Return to Inventory
      </RouterLink>

      <RouterLink
        v-if="auth.role === 'admin' && route.path === '/'"
        to="/add"
        class="px-3 py-1"
        style="text-decoration: none;"
      >
        Add Item
      </RouterLink>
    </div>

    <!-- Right Group: Auth Info -->
    <div v-if="auth.user" class="flex items-center gap-4 text-sm text-gray-400">
      <span>{{ auth.user.email }}</span>
      <button @click="handleLogout" class="text-red-400 hover:text-red-300">Logout</button>
    </div>

    <div v-else class="flex items-center gap-6">
      <RouterLink to="/login" class="hover:underline">Login</RouterLink>
      <RouterLink to="/register" class="hover:underline">Register</RouterLink>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useInventoryStore } from '../stores/inventory'

const auth = useAuthStore()
const inventoryStore = useInventoryStore()
const route = useRoute()
const router = useRouter()

const hasSelectedItems = computed(() => inventoryStore.selectedInventory.length > 0)

async function handleLogout() {
  await auth.logout()
  router.push('/login')
}
</script>
