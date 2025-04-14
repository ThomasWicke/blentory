import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useInventoryStore = defineStore('inventory', {
  state: () => ({
    // Now an array of objects: { id, quantity }
    selectedInventory: [],
    // Full list of inventory items
    inventory: []
  }),
  actions: {
    setInventory(data) {
      this.inventory = data
    },
    addItem(itemId) {
      // Only add if the item is not already in selectedInventory
      if (!this.selectedInventory.some(item => item.id === itemId)) {
        this.selectedInventory.push({ id: itemId, quantity: 1 })
      }
    },
    removeItem(itemId) {
      this.selectedInventory = this.selectedInventory.filter(item => item.id !== itemId)
    },
    toggleItem(itemId) {
      if (this.selectedInventory.some(item => item.id === itemId)) {
        this.removeItem(itemId)
      } else {
        this.addItem(itemId)
      }
    },
    clearSelection() {
      this.selectedInventory = []
    },
    // New action to update the quantity for an already selected item.
    updateQuantity(itemId, newQuantity) {
      const selectedItem = this.selectedInventory.find(item => item.id === itemId)
      if (selectedItem) {
        selectedItem.quantity = newQuantity
      }
    },
    // Action to load inventory data from the API.
    async loadInventory() {
      const { data, error } = await supabase.from('inventory').select('*')
      if (error) {
        console.error('Failed to load inventory:', error)
      } else {
        this.inventory = data
      }
    }
  }
})
