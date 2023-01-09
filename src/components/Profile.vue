<script setup lang="ts">
import {supabase} from "../supa"
import {store} from "../supa/store"
import {ref, watchEffect} from "vue"
import {promisedReactive} from '../utils/promisedReactive';

const loading = ref(true)
// const username = ref("")
// const website = ref("")
// const avatar_url = ref("")

interface Profile {
  username: string;
  website: string;
  avatar_url: string;
}

const profile = promisedReactive<Profile>(
    {username: '', website: '', avatar_url: ''},
    async () => {
      const sd = await supabase.auth.getSession()
      // store.session = supabase.auth.user()
      store.session = sd.data.session

      const {data, error, status} = await supabase
          .from("profiles")
          .select(`username, website, avatar_url`)
          .eq("id", store.session?.user.id)
          .single()

      if (error && status !== 406) throw error

      return data!;
    }
)

watchEffect(() => {
  loading.value = profile.loading;
  if (profile.error) {
    alert(profile.error.message);
  }
})

async function updateProfile() {
  try {
    loading.value = true
    store.session = (await supabase.auth.getSession()).data.session

    const updates = {
      id: store.session?.user.id,
      username: profile.value?.username,
      website: profile.value?.website,
      avatar_url: profile.value.avatar_url,
      updated_at: new Date(),
    }

    let {error} = await supabase.from("profiles")
        .upsert(updates, {
      // returning: "minimal", // Don't return the value after inserting
    })

    if (error)
      alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signOut() {
  try {
    loading.value = true
    let {error} = await supabase.auth.signOut()
    if (error) alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<template>

  <p>
    Du er logget inn som <strong>{{ store.session?.user.email }}</strong>
  </p>

  <div>
    <button class="button block" @click="signOut" :disabled="loading">
      Logg ut
    </button>
  </div>
  <form class="form-widget" @submit.prevent="updateProfile">
    <fieldset>
      <legend>Oppdater brukerinformasjon</legend>
      <div>
        <label for="email">Email</label>
        <input id="email" type="text" :value="store.session?.user.email" disabled/>
      </div>
      <div>
        <label for="username">Name</label>
        <input id="username" type="text" v-model="profile.value.username"/>
      </div>
      <div>
        <label for="website">Website</label>
        <input id="website" type="url" v-model="profile.value.website"/>
      </div>
    </fieldset>
    <div>
      <input
          type="submit"
          class="button block primary"
          :value="loading ? 'Loading ...' : 'Update'"
          :disabled="loading"
      />
    </div>

  </form>
</template>
