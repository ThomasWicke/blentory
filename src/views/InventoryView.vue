<template>
  <div>
    <div v-if="auth.user" >
      <InventoryTable :isAdmin="auth.role === 'admin'" />
    </div>
    <div v-else class="text-center mt-20 text-gray-400 text-lg">
      Please log in to access the inventory 📦
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import InventoryTable from '../components/InventoryTable.vue'

const auth = useAuthStore()
</script>
