<script lang="ts">
export default {
  name: "Home",
  path: "/home",
  alias: "/",
}
</script>

<template>
  <p>
    This is the home page of this wonderful app. 
  </p>
  <p>
    Please select a module: 
  </p>
  <ul>
    <router-link to="grades">Grades</router-link>
  </ul>
</template>
