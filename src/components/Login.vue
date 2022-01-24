<script lang="ts">

import {ref} from "vue"
import {supabase} from "../supa"

export default {
  setup() {
    const loading = ref(false)
    const email = ref("")
    const password = ref("")

    const handleMagicLogin = async () => {
      try {
        loading.value = true
        const {error} = await supabase.auth.signIn({email: email.value})
        if (error) throw error
        alert("Check your email for the login link!")
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        loading.value = false
      }
    }
    const handlePasswordLogin = async () => {
      try {
        loading.value = true
        const response = await supabase.auth.signIn({email: email.value, password: password.value});
        console.log('Response from sign-in: ', response);
        if (response.error) throw response.error
        alert("You are logged in now!")
      } catch (error) {
        alert(error.error_description || error.message)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      email,
      password,
      handleMagicLogin,
      handlePasswordLogin,
    }
  },
}
</script>

<template>

  <form class="row flex flex-center" @submit.prevent="handlePasswordLogin">
    <div class="col-6 form-widget">
      <p class="description">
        Sign in via e-mail and password.
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
            class="inputField"
            type="password"
            placeholder="Your password"
            v-model="password"
        />
      </div>
      <div>
        <input
            type="submit"
            class="button block"
            :value="loading ? 'Loading' : 'Login'"
            :disabled="loading"
        />
      </div>
    </div>
  </form>

  <form class="row flex flex-center" @submit.prevent="handleMagicLogin">
    <div class="col-6 form-widget">
      <p class="description">
        Sign in via magic link with your email below.
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
