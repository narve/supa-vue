<script setup lang="ts">
// export default {
//   name: "Home",
//   path: "/home",
//   alias: "/",
// }
  import {modules} from '../main'
</script>

<template>
  <h1>DV8 - Apps</h1>
  <p>
    This is the home page of this wonderful site.
  </p>
  <p>
    Please select a module: 
  </p>
  <ul v-for="m of modules" :key="m.name">
    <router-link :to="'/'+m.name">{{m.title}}</router-link>
  </ul>
</template>
