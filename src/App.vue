<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import HelloWorld from './components/HelloWorld.vue'
import DataComponent from "./components/DataComponent.vue";
import {useRouter} from "vue-router";
import { onMounted, Ref, ref, watchEffect } from "vue";
import {supabase} from "./supa";
import {store} from "./supa/store";
import {getOpenApi} from "./supa/supa-openapi";
import { asyncComputed } from './utils/asyncComputed';

const router = useRouter();
const routeList = ref(router.getRoutes());

store.user = supabase.auth.user()
console.log('Setup: ', {user: store.user});

interface DataList {
	name: string;
	path: string;
	component: any;
}

const dataList = asyncComputed<DataList[]>(
	[],
	() => {
		return getOpenApi(supabase)
			.then(data => {
				const toRemove = ['ceremony_statistics', 'countries', 'participant', 'participant_statistics', 'profiles', 'location', 'item'];
				return Object.keys(data.definitions)
					.filter(n => !toRemove.includes(n))
					.map(name => ({ name, path: `/show/${name}`, component: DataComponent }))
			});
	}
)

watchEffect(() => {
	if (dataList.error) {
		alert('Oopsie! Unable to load dataList: ' + dataList.error.message);
	}
})
</script>

<template>
  <nav>
    <RouterLink v-for='route of routeList.filter(s=>s.path.indexOf(":") < 0)' :to="route.path" :key="route.path">
      {{ route.name || route.path }}
    </RouterLink>
  </nav>

  <nav v-if="dataList.value.length">
    <RouterLink v-for="route of dataList.value" :to="route.path">
      {{ route.title || route.name || route.path }}
    </RouterLink>
  </nav>

  <!--  <button @click="addRoute">HIT ME</button>-->

  <p>
		<template v-if="store.user">Login status: {{ store.user.email }} - {{ store.user.role }}</template>
		<template v-else>NB: Not logged in</template>
	</p>

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
