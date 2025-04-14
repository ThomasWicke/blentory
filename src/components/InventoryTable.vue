<template>
  <div class="w-full h-[calc(100vh-40px)] overflow-y-auto">
    <table class="min-w-full table-fixed">
      <thead class="sticky top-0 bg-gray-700 text-gray-200 z-10">
        <tr>
          <th class="px-4 py-2 text-left">#</th>
          <th class="px-4 py-2 text-left">Select</th>
          <th class="px-4 py-2 text-left">Quantity</th>
          <!-- Clicking the header toggles sorting by name -->
          <th @click="toggleSort('name')" class="px-4 py-2 text-left cursor-pointer whitespace-nowrap">
            Item 
            <span class="ml-1">
              <span v-if="sortKey === 'name'" class="text-white">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </span>
          </th>
          <th class="px-4 py-2 text-left">Amount</th>
          <th class="px-4 py-2 text-left">Price</th>
          <!-- Clicking the header toggles sorting by category -->
          <th @click="toggleSort('category')" class="px-4 py-2 text-left cursor-pointer whitespace-nowrap">
            Category 
            <span class="ml-1">
              <span v-if="sortKey === 'category'" class="text-white">
                {{ sortOrder === 'asc' ? '↑' : '↓' }}
              </span>
            </span>
          </th>
          <th class="px-4 py-2 text-left">Status</th>
          <th v-if="isAdmin" class="px-4 py-2 text-left">Actions</th>
        </tr>
      </thead>

      <tbody class="bg-gray-800 text-white">
        <tr 
          v-for="(item, index) in sortedInventory" 
          :key="item.id" 
          class="hover:bg-gray-700"
          :class="{ 'bg-gray-700': isSelected(item.id) }"
        >
          <td class="px-4 py-2">{{ index + 1 }}</td>
          <td class="px-4 py-2">
            <input
              type="checkbox"
              :value="item.id"
              :checked="isSelected(item.id)"
              @change="inventoryStore.toggleItem(item.id)"
              class="form-checkbox"
            />
          </td>
          <td class="px-4 py-2">
            <input 
              type="number" 
              :value="getQuantity(item.id)"
              :max="item.amount"
              :min="1"
              :disabled="!isSelected(item.id)"
              @change="onQuantityChange(item, $event.target.value)"
              class="w-16 p-1 text-white"
            />
          </td>
          <td class="px-4 py-2">{{ item.name }}</td>
          <td class="px-4 py-2">{{ item.amount }}</td>
          <td class="px-4 py-2">€{{ item.price_per_day }}</td>
          <td class="px-4 py-2">{{ item.category }}</td>
          <td class="px-4 py-2">{{ item.status }}</td>
          <td v-if="isAdmin" class="px-4 py-2">
            <button @click="startEdit(item)" class="text-yellow-400 hover:underline mr-2">Edit</button>
            <button @click="deleteItem(item.id)" class="text-red-400 hover:underline">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Edit Modal -->
  <div v-if="editing" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-gray-800 text-white p-6 rounded shadow-lg w-11/12 max-w-lg relative">
      <h2 class="font-semibold mb-4 text-xl">Edit Item</h2>
      <form @submit.prevent="submitEdit" class="grid gap-4">
        <input v-model="editItem.name" placeholder="Name" class="p-2 bg-gray-700 rounded" />
        <input v-model.number="editItem.amount" placeholder="Amount" class="p-2 bg-gray-700 rounded" />
        <input v-model.number="editItem.price_per_day" placeholder="Price" class="p-2 bg-gray-700 rounded" />
        <input v-model="editItem.category" placeholder="Category" class="p-2 bg-gray-700 rounded" />
        <input v-model="editItem.status" placeholder="Status" class="p-2 bg-gray-700 rounded" />
        <div class="flex gap-4 justify-end">
          <button type="submit" class="bg-blue-600 px-4 py-2 text-white rounded">Save</button>
          <button @click="cancelEdit" type="button" class="text-gray-400 hover:text-white">Cancel</button>
        </div>
      </form>
      <!-- Optional close button -->
      <button
        @click="cancelEdit"
        class="absolute top-2 right-2 text-gray-400 hover:text-white text-xl"
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useInventoryStore } from '../stores/inventory'
import { supabase } from '../lib/supabase'

const inventoryStore = useInventoryStore()
const auth = useAuthStore()

// Receive isAdmin as a prop for consistency.
const { isAdmin } = defineProps({
  isAdmin: Boolean
})

const emit = defineEmits(['refresh'])

// Local sorting properties.
const sortKey = ref('name')
const sortOrder = ref('asc')

// Computed property for the sorted inventory from the store.
const sortedInventory = computed(() => {
  if (!sortKey.value) return inventoryStore.inventory
  return [...inventoryStore.inventory].sort((a, b) => {
    const aValue = a[sortKey.value]?.toString().toLowerCase() || ''
    const bValue = b[sortKey.value]?.toString().toLowerCase() || ''
    if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1
    if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1
    return 0
  })
})

function toggleSort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
}

// Helper methods for quantity management
const isSelected = (itemId) => {
  return inventoryStore.selectedInventory.some(selected => selected.id === itemId)
}

const getQuantity = (itemId) => {
  const selected = inventoryStore.selectedInventory.find(selected => selected.id === itemId)
  return selected ? selected.quantity : 1
}

const onQuantityChange = (item, newValue) => {
  const quantity = Math.min(Number(newValue), item.amount)
  if (isSelected(item.id)) {
    inventoryStore.updateQuantity(item.id, quantity)
  }
}

// Edit Modal state and functions.
const editing = ref(false)
const editItem = ref(null)

async function deleteItem(id) {
  if (!window.confirm("Are you sure you want to delete this item?")) {
    return;
  }
  const { error } = await supabase.from('inventory').delete().eq('id', id)
  if (error) console.error(error)
  else await inventoryStore.loadInventory()
}

function startEdit(item) {
  console.log('Editing item:', item)
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
    await inventoryStore.loadInventory()
  }
}

// On mount, load the inventory from the store.
onMounted(() => {
  inventoryStore.loadInventory()
})
</script>
