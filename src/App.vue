<script setup lang="ts">
import {supabase} from "./supa";
import {store} from "./supa/store";
import {router} from "./main";
import {ref} from "vue";
import {PostgrestError} from "@supabase/supabase-js";


supabase.auth.getSession().then(({data}) => {
  // console.log('Setup: ', {data, error});
  store.session = data.session
})

const isLoading = ref(false)
const loadText = ref(null as string|null)

const onStartLoading = (args:any) => {
  console.log('start loading:', args)
  isLoading.value = true
  loadText.value = args
}
const onDoneLoading = () => {
  isLoading.value = false
  loadText.value = null
}

const onError = (error: PostgrestError) => {
  isLoading.value = true
  loadText.value = error.message
  setTimeout(onDoneLoading, 2500)
}

const onUncaughtError = (msg: string) => {
  // console.log(evt)
  isLoading.value = true
  loadText.value = "Uncaught error: " + msg
  setTimeout(onDoneLoading, 2500)
}

window.addEventListener('error', (args) => onUncaughtError(args.message))
window.addEventListener('unhandledrejection', (args) => onUncaughtError(args.reason?.message))

</script>

<template>

  <div class="loading-indicator" v-if="isLoading">
    {{loadText || 'Loading'}}
  </div>

  <div style="float:right; display:inline-block;">
    <RouterLink to="/api">
      <i class="material-icons">settings</i>
    </RouterLink>
    <RouterLink to="/auth" v-if="router.currentRoute.value.name !== 'auth'">
      <!--      <span v-if="!!store.session">{{ store.session }}</span>-->
      <i class="material-icons">person</i>
    </RouterLink>
    <RouterLink to="/" v-if="router.currentRoute.value.name !== 'home'">
      Hjem
      <i class="material-icons">home</i>
    </RouterLink>
  </div>


  <section class="styled">
    <!--    <Suspense>-->
    <router-view
        @startloading="onStartLoading"
        @doneloading="onDoneLoading"
        @error="onError"
    ></router-view>
  </section>


</template>

<!-- Non-scoped ?! -->
<!--suppress CssUnusedSymbol -->
<style>

@import "https://igoradamenko.github.io/awsm.css/css/awsm_theme_gondola.css" only screen;

@media print {
  .screen {
    display: none;
  }

  .page:not(:first-of-type) {
    break-before: page;
  }
}

.loading-indicator {
  position: fixed;
  font-size: xxx-large;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  outline: darkred solid 3px;
}


button {
  padding: 2px;
  margin: 4px;
}


nav {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  nav {
    display: none;
  }

  nav.module {
    display: flex;
  //display: block;
  }
}

a {
  padding-right: 0.5em;
  /*outline: greenyellow 1px solid;*/
}

</style>
