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

    const handleFacebookLogin = async () => {
      try {
        loading.value = true
        const {user, session, error} = await supabase.auth.signIn({
          provider: 'facebook',
        });
        console.log('Response from sign-in: ', {user, session, error});
        if (error)
          alert(error.message);
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
      handleFacebookLogin
    }
  },
}
</script>

<template>

  <form>
    <label>
      Logg inn vha Facebook:
      <button style="border: none; background-color: inherit;" @click="handleFacebookLogin">
        <img role="button" src="/src/assets/fb.png" alt="facebook" style="max-width: 2em; display: inline-block;">
      </button>
    </label>

  </form>


  <form class="row flex flex-center" @submit.prevent="handlePasswordLogin">
    <div class="col-6 form-widget">
      <p class="description">
        Logg inn vha e-post og passord, hvis du har registrert deg tidligere. 
        Ikke bruk passordet til din e-post! 
      </p>
      <div>
        <input
            class="inputField"
            type="email"
            placeholder="E-post"
            v-model="email"
        />
      </div>
      <div>
        <input
            class="inputField"
            type="password"
            placeholder="passord"
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
        Logg inn / registrer deg ved å få tilsendt en magisk innloggingslenke: 
      </p>
      <div>
        <input
            class="inputField"
            type="email"
            placeholder="e-post"
            v-model="email"
        />
      </div>
      <div>
        <input
            type="submit"
            class="button block"
            :value="loading ? 'Loading' : 'Send innloggingslenke'"
            :disabled="loading"
        />
      </div>
    </div>
  </form>

</template>
