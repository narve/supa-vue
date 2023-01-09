<script setup lang="ts">
import {supabase} from "./supa";
import {store} from "./supa/store";
import {router} from "./main";

supabase.auth.getSession().then(({data, error}) => {
  console.log('Setup: ', {data, error});
  store.session = data.session
})

</script>

<template>

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


  <section>
    <!--    <Suspense>-->
    <router-view></router-view>
  </section>


</template>

<!-- Non-scoped ?! -->
<style>

@import "https://igoradamenko.github.io/awsm.css/css/awsm_theme_gondola.css" only screen;

/*
@import url('path.css') (screen and min/max-width: 600px);
*/
@media screen {

}

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
