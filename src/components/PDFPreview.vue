<template>
    <!-- Use inline styles so that unsupported CSS functions (like oklch) aren’t generated -->
    <div
      id="pdf-preview"
      style="border: none; padding: 1rem; background-color: #ffffff; color: #000000;"
    >
      <h3 style="font-size: 1.125rem; font-weight: 700; margin-bottom: 0.5rem;">
        Renting Slip
      </h3>
      <!-- Renter Details -->
      <div style="margin-bottom: 1rem;">
        <p>
          <strong>Name/Business:</strong>
          {{ renterInfo.name || '[Not provided]' }}
        </p>
        <p>
          <strong>Email:</strong>
          {{ renterInfo.email || '[Not provided]' }}
        </p>
        <p>
          <strong>Pickup Date:</strong>
          {{ renterInfo.pickupDate || '[Not provided]' }}
        </p>
        <p>
          <strong>Dropoff Date:</strong>
          {{ renterInfo.dropoffDate || '[Not provided]' }}
        </p>
        <!-- New row: Total Price -->
        <p>
          <strong>Total Price:</strong>
          €{{ totalPrice.toFixed(2) }}
        </p>
      </div>
      <!-- Table of Selected Items -->
      <div>
        <table style="width: 100%; font-size: 0.875rem; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border-bottom: 1px solid #d1d5db; padding: 0.25rem; text-align: left;">Item</th>
              <th style="border-bottom: 1px solid #d1d5db; padding: 0.25rem; text-align: left;">Quantity</th>
              <th style="border-bottom: 1px solid #d1d5db; padding: 0.25rem; text-align: left;">Price/Day</th>
              <th style="border-bottom: 1px solid #d1d5db; padding: 0.25rem; text-align: left;">Category</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedItems" :key="item.id">
              <td style="padding: 0.25rem; border-bottom: 1px solid #e5e7eb;">{{ item.name }}</td>
              <td style="padding: 0.25rem; border-bottom: 1px solid #e5e7eb;">{{ item.quantity || 1 }}</td>
              <td style="padding: 0.25rem; border-bottom: 1px solid #e5e7eb;">€{{ item.price_per_day }}</td>
              <td style="padding: 0.25rem; border-bottom: 1px solid #e5e7eb;">{{ item.category }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue'
  
  const props = defineProps({
    renterInfo: {
      type: Object,
      required: true
    },
    selectedItems: {
      type: Array,
      required: true
    }
  })
  
  const totalPrice = computed(() => {
    if (!props.renterInfo.pickupDate || !props.renterInfo.dropoffDate) return 0;
    const pickup = new Date(props.renterInfo.pickupDate);
    const dropoff = new Date(props.renterInfo.dropoffDate);
    const diffTime = dropoff.getTime() - pickup.getTime();
    const diffDays = diffTime > 0 ? diffTime / (1000 * 60 * 60 * 24) : 0;
    // Multiply each item's price per day by its quantity (defaulting to 1) then sum
    const dailySum = props.selectedItems.reduce((sum, item) => {
      return sum + item.price_per_day * (item.quantity || 1)
    }, 0);
    return dailySum * diffDays;
  });
  </script>
  