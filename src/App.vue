<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import DataComponent from "./components/DataComponent.vue";
import {useRouter} from "vue-router";
import {ref} from "vue";
import {supabase} from "./supa";
import {store} from "./supa/store";
import {getOpenApi} from "./supa/supa-openapi";

const router = useRouter();

const routeList = ref(router.getRoutes());

// const addRoute = () => {
//   router.addRoute({
//     name: 'new-route',
//     path: "/new",
//     component: HelloWorld,
//   });
//   routeList.value = router.getRoutes();
// }

store.user = supabase.auth.user()
console.log('Setup: ', {user: store.user});
supabase.auth.onAuthStateChange((_, session) => {
  store.user = session.user
})

const dataList = ref([]);

getOpenApi(supabase)
    .then((data: { definitions: {}; }) => {
      const toRemove = ['ceremony_statistics', 'countries', 'participant', 'participant_statistics', 'profiles', 'location', 'item'];
      const names = Object.keys(data.definitions)
          .filter(n => toRemove.indexOf(n) < 0);

      for (const name of names) {
        // router.addRoute( {name, path: `/show/{name}`, component: DataComponent});
        dataList.value.push({name, path: `/show/${name}`, component: DataComponent});
        // dataList.value.push('hei');
      }


      console.log('got oapi: ', names);
    });
</script>

<template>
  <!--  <img alt="Vue logo" src="./assets/logo.png"/>-->

  <nav>
    <RouterLink v-for='route of routeList.filter(s=>s.path.indexOf(":") < 0)' :to="route.path">
      {{ route.name || route.path }}
    </RouterLink>
  </nav>

  <nav>
    <RouterLink v-for='route of dataList' :to="route.path">
      {{ route.title || route.name || route.path }}
    </RouterLink>
  </nav>

  <!--  <button @click="addRoute">HIT ME</button>-->

  <p v-if="store.user">Login status: {{ store.user.email }} - {{ store.user.role }}</p>
  <p v-if="!store.user">NB: Not logged in</p>

  <section>
    <h1>{{ $route.name }}</h1>
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
