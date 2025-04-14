<template>
    <table class="min-w-full table-auto border border-gray-700 text-left">
      <thead class="bg-gray-900 text-gray-200">
        <tr>
          <th class="border px-4 py-2">#</th>
          <th class="border px-4 py-2">Name</th>
          <th class="border px-4 py-2">Amount</th>
          <th class="border px-4 py-2">Price</th>
          <th class="border px-4 py-2">Category</th>
          <th class="border px-4 py-2">Status</th>
          <th v-if="isAdmin" class="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-gray-800 text-white">
        <tr v-for="(item, index) in inventory" :key="item.id" class="hover:bg-gray-700">
          <td class="border px-4 py-2">{{ index + 1 }}</td>
          <td class="border px-4 py-2">{{ item.name }}</td>
          <td class="border px-4 py-2">{{ item.amount }}</td>
          <td class="border px-4 py-2">${{ item.purchasing_price }}</td>
          <td class="border px-4 py-2">{{ item.category }}</td>
          <td class="border px-4 py-2">{{ item.status }}</td>
          <td v-if="isAdmin" class="border px-4 py-2 space-x-2">
            <button @click="startEdit(item)" class="text-yellow-400 hover:underline">Edit</button>
            <button @click="deleteItem(item.id)" class="text-red-400 hover:underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  
    <!-- Optional: Simple Edit Inline -->
    <div v-if="editing" class="mt-6 p-4 bg-gray-800 rounded">
      <h2 class="font-semibold mb-2">Edit Item</h2>
      <form @submit.prevent="submitEdit" class="grid gap-2">
        <input v-model="editItem.name" placeholder="Name" class="p-2 bg-gray-700 rounded" />
        <input v-model.number="editItem.amount" placeholder="Amount" class="p-2 bg-gray-700 rounded" />
        <input v-model.number="editItem.purchasing_price" placeholder="Price" class="p-2 bg-gray-700 rounded" />
        <input v-model="editItem.category" placeholder="Category" class="p-2 bg-gray-700 rounded" />
        <input v-model="editItem.status" placeholder="Status" class="p-2 bg-gray-700 rounded" />
        <div class="flex gap-4">
          <button type="submit" class="bg-blue-600 px-4 py-2 text-white rounded">Save</button>
          <button @click="cancelEdit" type="button" class="text-gray-400 hover:text-white">Cancel</button>
        </div>
      </form>
    </div>
  </template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const props = defineProps({
  isAdmin: Boolean
})

const emit = defineEmits(['refresh'])

const inventory = ref([])
const editing = ref(false)
const editItem = ref(null)

async function loadInventory() {
  const { data, error } = await supabase.from('inventory').select('*')
  if (error) console.error(error)
  else inventory.value = data
}

async function deleteItem(id) {
  const { error } = await supabase.from('inventory').delete().eq('id', id)
  if (error) console.error(error)
  else await loadInventory()
}

function startEdit(item) {
  editItem.value = { ...item }
  editing.value = true
}

function cancelEdit() {
  editing.value = false
  editItem.value = null
}

async function submitEdit() {
  const { error } = await supabase
    .from('inventory')
    .update(editItem.value)
    .eq('id', editItem.value.id)

  if (error) console.error(error)
  else {
    editing.value = false
    editItem.value = null
    await loadInventory()
  }
}

onMounted(() => {
  loadInventory()
})
</script>
