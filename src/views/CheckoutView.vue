<template>
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-4">Checkout</h1>
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Left: Renter Details Form -->
        <div class="md:w-1/2">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300">
                Full Name / Business Name
              </label>
              <input
                v-model="renterInfo.name"
                type="text"
                class="mt-1 block w-full p-2 bg-gray-700 rounded"
                placeholder="Enter name or business"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                v-model="renterInfo.email"
                type="email"
                class="mt-1 block w-full p-2 bg-gray-700 rounded"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300">
                Pickup Date
              </label>
              <input
                v-model="renterInfo.pickupDate"
                type="date"
                class="mt-1 block w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300">
                Dropoff Date
              </label>
              <input
                v-model="renterInfo.dropoffDate"
                type="date"
                class="mt-1 block w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>
            <button type="submit" class="bg-green-600 px-4 py-2 rounded text-white">
              Confirm Checkout
            </button>
          </form>
        </div>
    
        <!-- Right: PDF Preview of Renting Slip -->
        <div class="md:w-1/2">
          <h2 class="text-xl font-semibold mb-2">Renting Slip Preview</h2>
          <PDFPreview :renterInfo="renterInfo" :selectedItems="selectedItemsDetailed" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { jsPDF } from 'jspdf'
  import PDFPreview from '../components/PDFPreview.vue'
  import { useInventoryStore } from '../stores/inventory'
  
  const inventoryStore = useInventoryStore()
  
  // Load the inventory if it hasn't already been loaded.
  onMounted(async () => {
    if (inventoryStore.inventory.length === 0) {
      await inventoryStore.loadInventory()
      console.log('Inventory loaded:', inventoryStore.inventory)
    }
  })
  
  // Compute the detailed list of selected items by matching items from the full inventory
  // with the selectedInventory objects (which now include quantity).
  const selectedItemsDetailed = computed(() => {
    return inventoryStore.inventory
      .filter(item =>
        inventoryStore.selectedInventory.some(selected => selected.id === item.id)
      )
      .map(item => {
        const selected = inventoryStore.selectedInventory.find(
          selected => selected.id === item.id
        )
        return { ...item, quantity: selected.quantity }
      })
  })
  
  // Renter information bound to form inputs.
  const renterInfo = ref({
    name: '',
    email: '',
    pickupDate: '',
    dropoffDate: ''
  })
  
  // Generate the PDF on submit.
  async function handleSubmit() {
    const previewElement = document.getElementById("pdf-preview")
    if (!previewElement) {
      console.error("PDF preview element not found.")
      return
    }
    
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    await doc.html(previewElement, {
      callback: function (doc) {
        doc.save("renting_slip.pdf")
      },
      x: 20,
      y: 20,
      width: 595,
      html2canvas: {
        scale: 0.8 // adjust scale if needed to shrink the content
      }
    })
  }
  </script>
  