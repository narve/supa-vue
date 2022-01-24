<script setup lang="ts">

import {fetchDataAsync, supabase} from "../supa";
import {useRouter} from "vue-router";
import {Ref, ref, UnwrapRef, watch} from "vue";

const router = useRouter();


const data = ref([]);
const columns = ref<string[]>([]);

const applyTable = () => {
  const tableName = router.currentRoute.value.params.name;
  console.log('fetching: ', tableName);
  fetchDataAsync(supabase, tableName)
      .then((x: any) => {
        console.log('meta: ', x.meta);
        data.value = x.data;
        columns.value = Object.keys(x.meta.properties);
      });
}
applyTable();

watch(
    () => router.currentRoute.value.params,
    () => applyTable());


const cellToString = (cell: any) => !cell ? '' : (cell.handle || cell.name || cell);

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
        {{ cellToString(cell) }}
<!--        <span>-->
<!--          {{JSON.stringify(cell)}}-->
<!--        </span>-->
      </td>
    </tr>
    </tbody>
  </table>

</template>
