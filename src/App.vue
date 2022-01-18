<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import {useRouter} from "vue-router";
import {ref} from "vue";

const router = useRouter();

const routeList = ref(router.getRoutes());

const addRoute = () => {
  router.addRoute({
    name: 'new-route',
    path: "/new",
    component: HelloWorld,
  });
  routeList.value = router.getRoutes();
}

</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png"/>

  <!--  <HelloWorld msg="Hello World 6"/>-->
  <nav>
    <RouterLink v-for="route of routeList" :to="route.path">
      {{ route.name || route.path }} A
    </RouterLink>
  </nav>

  <button @click="addRoute">HIT ME</button>

  <RouterView></RouterView>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
