<script lang="ts">

import { ref } from "vue"
import { supabase } from "../supa"

export default {
  setup() {
    const loading = ref(false)
    const email = ref("")

    const handleLogin = async () => {
      try {
        loading.value = true
        const { error } = await supabase.auth.signIn({ email: email.value })
        if (error) throw error
        alert("Check your email for the login link!")
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      email,
      handleLogin,
    }
  },
}
</script>

<template>

  <form class="row flex flex-center" @submit.prevent="handleLogin">
    <div class="col-6 form-widget">
      <p class="description">
        You are currently not logged in. 
        Sign in via magic link with your email below.
        If you don't already have a user it will be created for you. 
      </p>
      <div>
        <input
            class="inputField"
            type="email"
            placeholder="Your email"
            v-model="email"
        />
      </div>
      <div>
        <input
            type="submit"
            class="button block"
            :value="loading ? 'Loading' : 'Send magic link'"
            :disabled="loading"
        />
      </div>
    </div>
  </form>
  
</template>
