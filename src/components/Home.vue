<script  >
export default {
  name: "Home",
  path: "/home",
  alias: "/",
}
</script>

<template>
  <h1>DV8 - Apps</h1>
  <p>
    This is the home page of this wonderful site.
  </p>
  <p>
    Please select a module: 
  </p>
  <ul>
    <router-link to="grades">Grades</router-link>
  </ul>
</template>
