import { createClient } from '@/lib/supabase/client'

export const authService = {
  async signUp(name: string, email: string, password: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: name },
      },
    })
    if (error) throw new Error(error.message)
  },

  async signIn(email: string, password: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
  },

  async signOut(): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) throw new Error(error.message)
  },

  async resetPassword(email: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    })
    if (error) throw new Error(error.message)
  },

  async updatePassword(newPassword: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) throw new Error(error.message)
  },

  async getUser() {
    const supabase = createClient()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw new Error(error.message)
    return user
  },

  onAuthStateChange(
    callback: Parameters<ReturnType<typeof createClient>['auth']['onAuthStateChange']>[0]
  ) {
    const supabase = createClient()
    return supabase.auth.onAuthStateChange(callback)
  },
}
