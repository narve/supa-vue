<script setup lang="ts">

import {fetchDataAsync, supabase} from "../supa";
import {useRouter} from "vue-router";
import {Ref, ref, UnwrapRef, watch} from "vue";

const router = useRouter();

const newObject = ref({});

const data = ref([]);
const columns = ref<string[]>([]);
const editableColumns = ref<string[]>([]);

const applyTable = () => {
  const tableName = router.currentRoute.value.params.name;
  console.log('fetching: ', tableName);
  fetchDataAsync(supabase, tableName)
      .then((x: any) => {
        console.log('meta: ', x.meta);
        data.value = x.data;
        columns.value = Object.keys(x.meta.properties);

        editableColumns.value = columns.value
            .map(c => x.meta.properties[c])
            .filter(c => !c.isPk)
            .map(c => c.name)
        ;

        console.log('editable columns: ', JSON.stringify(editableColumns.value));

      });
}
applyTable();

watch(
    () => router.currentRoute.value.params,
    () => applyTable());


const cellToString = (cell: any) => !cell ? '' : (cell.handle || cell.name || cell);

const handleCreate = (args: any) => {
  const tableName = router.currentRoute.value.params.name;
  console.log('create: ', JSON.stringify(newObject.value));
  supabase.from(tableName).insert([newObject.value])
      .then((x: any) => {
        console.log('response: ', x);
        if (x.error) throw x.error;
        applyTable();
      }).catch((err: any) => alert(err.message));
  ;
}

const deleteRow = (id: any) => {
  console.log('should delete: ', id);
  const tableName = router.currentRoute.value.params.name;
  supabase.from(tableName).delete([id]).eq('id', id)
      .then((x: any) => {
        console.log('response: ', x);
        if (x.error) throw x.error;
        applyTable();
      }).catch((err: any) => alert(err.message));
  ;
}

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
      <td>
        <button @click="deleteRow(row.id)">DELETE</button>
      </td>
    </tr>
    </tbody>
  </table>


  <form @submit.prevent="handleCreate">
    <fieldset>
      <legend>Create new</legend>
      <label v-for="field of editableColumns">
        {{ field }}
        <input name="field" v-model="newObject[field]" v-bind:placeholder="field">
      </label>
      <input type="submit">
    </fieldset>
  </form>

</template>
