<template>
    <div class="max-w-xl mx-auto mt-10 bg-gray-800 p-6 rounded">
      <h1 class="text-2xl font-bold mb-4 text-white">Add New Item</h1>
  
      <form @submit.prevent="handleSubmit" class="grid gap-4">
        <input v-model="item.name" placeholder="Name" class="p-2 bg-gray-700 text-white rounded" required />
        <input v-model.number="item.amount" type="number" placeholder="Amount" class="p-2 bg-gray-700 text-white rounded" required />
        <input v-model.number="item.price_per_day" type="number" placeholder="Purchasing Price" class="p-2 bg-gray-700 text-white rounded" required />
        <input v-model="item.category" placeholder="Category" class="p-2 bg-gray-700 text-white rounded" required />
        <input v-model="item.status" placeholder="Status" class="p-2 bg-gray-700 text-white rounded" required />
  
        <div class="flex gap-4">
        <button type="submit" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500">
          Save Item
        </button>

        <button @click="handleSubmitAndContinue" type="button" class="border border-gray-500 text-gray-300 px-4 py-2 rounded hover:bg-gray-700">
          Save and add more
        </button>
        </div>

        <p v-if="message" class="text-green-400 mt-2">{{ message }}</p>

      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { supabase } from '../lib/supabase'
  
  const router = useRouter()
  const message = ref('')
  
  const item = ref({
    name: '',
    amount: '',
    price_per_day: '',
    category: '',
    status: ''
  })
  
  async function handleSubmit() {
    const { error } = await supabase.from('inventory').insert([item.value])
    if (error) {
      console.error('Error adding item:', error.message)
      message.value = 'Failed to add item.'
    } else {
      message.value = 'Item added!'
      setTimeout(() => {
        router.push('/')
      }, 1000)
    }
  }
  async function handleSubmitAndContinue() {
  const { error } = await supabase.from('inventory').insert([item.value])
  if (error) {
    console.error('Error adding item:', error.message)
    message.value = 'Failed to add item.'
  } else {
    message.value = 'Item saved. You can add another!'
    // Reset form
    item.value = {
      name: '',
      amount: '',
      price_per_day: '',
      category: '',
      status: ''
    }
  }
}

  </script>
  