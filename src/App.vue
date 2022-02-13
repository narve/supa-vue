<script setup lang="ts">
import DataComponent from "./components/DataComponent.vue";
import {useRouter} from "vue-router";
import {watchEffect} from "vue";
import {supabase} from "./supa";
import {store} from "./supa/store";
import {getOpenApi} from "./supa/supa-openapi";
import {promisedReactive} from './utils/promisedReactive';

const router = useRouter();
// const routeList = ref(router.getRoutes());

store.user = supabase.auth.user()
console.log('Setup: ', {user: store.user});

interface DataList {
  name: string;
  path: string;
  component: any;
}

const dataList = promisedReactive<DataList[]>(
    [],
    () => {
      return getOpenApi(supabase)
          .then(data => {
            const toRemove = ['ceremony_statistics', 'countries', 'participant', 'participant_statistics', 'profiles', 'location', 'item'];
            return Object.keys(data.definitions)
                .filter(n => !toRemove.includes(n))
                .map(name => ({name, path: `/show/${name}`, component: DataComponent}))
          });
    }
)

// const filteredRouteList = computed(() => routeList.value.filter(s => s.path.indexOf(":") < 0));

watchEffect(() => {
  if (dataList.error) {
    alert('Oopsie! Unable to load dataList: ' + dataList.error.message);
  }
})
</script>

<template>

  <div style="float:right; display:inline-block;">
    <RouterLink to="/api" v-if="supabase.auth.user()?.email==='narve@dv8.no'">
      <i class="material-icons">settings</i>
    </RouterLink>
    <RouterLink to="auth" v-if="router.currentRoute.value.name !== 'auth'">
      <span v-if="!!supabase.auth.user()?.id">{{ supabase.auth.user()?.email }}</span>
      <i class="material-icons">person</i>
    </RouterLink>
    <RouterLink to="/home" v-if="router.currentRoute.value.name !== 'home'">
      Hjem
      <i class="material-icons">home</i>
    </RouterLink>
  </div>


  <h1>Dugnad!</h1>


  <!--  <p>-->
  <!--    <span v-if="store.user" :title="store.user.role">{{ store.user.email }}</span>-->
  <!--    &lt;!&ndash;    <template v-if- {{ store.user.role }}</template>&ndash;&gt;-->
  <!--    &lt;!&ndash;    <template v-else>NB: Not logged in</template>&ndash;&gt;-->
  <!--  </p>-->

  <!--  <nav>-->
  <!--    <RouterLink v-for='route of filteredRouteList' :to="route.path" :key="route.path">-->
  <!--      {{ route.name || route.path }}-->
  <!--    </RouterLink>-->
  <!--  </nav>-->

  <!--  <nav v-if="dataList.value.length">-->
  <!--    <RouterLink v-for="route of dataList.value" :to="route.path">-->
  <!--      {{ route.title || route.name || route.path }}-->
  <!--    </RouterLink>-->
  <!--  </nav>-->

  <!--  <button @click="addRoute">HIT ME</button>-->


  <section>
    <!--    <h1>{{ $route.name }}</h1>-->
    <RouterView></RouterView>
  </section>


</template>

<style scoped>

nav {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  nav {
    display: none;
  }
}

a {
  padding-right: 0.5em;
  /*outline: greenyellow 1px solid;*/
}

</style>
