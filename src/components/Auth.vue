<script>
import {store} from "../supa/store.js";
import {supabase} from "../supa";
import Auth from "./Login.vue"
import Profile from "../components/Profile.vue"

export default {
  name: "User&Registration",
  path: "/auth",
  
  components: {
    Auth,
    Profile,
  },

  setup() {
    store.user = supabase.auth.user()
    console.log('Setup: ', {user: store.user});
    supabase.auth.onAuthStateChange((_, session) => {
      store.user = session.user
    })

    return {
      store,
    }
  },
}

</script>
<template>


  <div class="container" style="padding: 50px 0 100px 0">
    <Profile v-if="store.user"/>
    <Auth v-else/>
  </div>

</template>
