<script setup lang="ts">

import {fetchDataAsync, supabase} from "../supa";
import {useRouter} from "vue-router";
import {Ref, ref, UnwrapRef} from "vue";

const router = useRouter();

const tableName = router.currentRoute.value.params.name;
console.log('fetching: ', tableName);

const data = ref([]);
const columns = ref<string[]>([]);

fetchDataAsync(supabase, tableName)
    .then((x: any) => {
      console.log('meta: ', x.meta);
      data.value = x.data;
      columns.value = Object.keys(x.meta.properties);
    });

// function beforeRouteUpdate(to, from) {
//   console.log('wtf');
// }

</script>
<template>

  <table border="1">
    <thead>
    <tr>
      <th v-for="column in columns">
        {{ column }}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="row of data">
      <!--      <td>{{row}}</td>-->
      <td v-for="cell in row">
        {{ cell.id ? cell.handle : cell }}
      </td>
    </tr>
    </tbody>
  </table>

</template>
