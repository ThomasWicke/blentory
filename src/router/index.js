import { createRouter, createWebHistory } from 'vue-router'
import InventoryView from '../views/InventoryView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AddItemView from '../views/AddItemView.vue'

const routes = [
  { path: '/', component: InventoryView },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/add', component: AddItemView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
