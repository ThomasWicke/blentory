import { defineStore } from 'pinia'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    role: null,
  }),
  actions: {
    async login(email, password) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      this.user = data.user

      // Fetch role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      this.role = profile?.role || null
    },
    async logout() {
      await supabase.auth.signOut()
      this.user = null
      this.role = null
    },
    async fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      this.user = user

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        this.role = profile?.role || null
      }
    }
  }
})
