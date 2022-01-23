<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import {useRouter} from "vue-router";
import {ref} from "vue";
import {store} from "./supa/store";

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
  <!--  <img alt="Vue logo" src="./assets/logo.png"/>-->

  <nav>
    <RouterLink v-for="route of routeList" :to="route.path">
      {{ route.name || route.path }}
    </RouterLink>
  </nav>

<!--  <button @click="addRoute">HIT ME</button>-->

  <p>Login status: {{store.user.email}}</p>
  
  <section>
    <h1>{{$route.name}}</h1>
    <RouterView></RouterView>
  </section>

  
</template>

<style scoped>

a {
  padding-right: 0.5em;
  outline: greenyellow 1px solid;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
