<script setup lang="ts">

import {fetchDataAsync, supabase} from "../supa";
import {useRouter} from "vue-router";
import {Ref, ref, UnwrapRef, watch} from "vue";

let tableName = ref('...')

const router = useRouter();

const newObject = ref({});

const data = ref([]);
const columns = ref<string[]>([]);
const editableColumns = ref<string[]>([]);
const tableColumns = ref<string[]>([]);

const selectors = ref({
  asdf: [4, 5, 6].map(i => ({
    id: "id_" + i,
    title: "value number " + i,
  }))
});

const applyTable = () => {
  tableName.value = router.currentRoute.value.params.name as string;
  console.log('fetching: ', tableName.value);
  fetchDataAsync(supabase, tableName.value)
      .then((x: any) => {
        console.log('meta: ', x.meta);
        data.value = x.data;
        columns.value = Object.keys(x.meta.properties);

        editableColumns.value = columns.value
            .map(c => x.meta.properties[c])
            .filter(c => !c.isPk)
        // .map(c => c.name);
        // console.log('editable columns: ', JSON.stringify(editableColumns.value));

        tableColumns.value = columns.value
            .map(c => x.meta.properties[c])
            .filter(c => !c.isPk);
        // .map(c => c.isFk && !!c.fk.table ? c.fk.table : c);
        // console.log('tableColumns: ', JSON.stringify(tableColumns.value));

        const fkTablesToFetch = Object.keys(x.meta.properties)
            .map(propName => x.meta.properties[propName])
            .filter(prop => prop.isFk)
            .map(prop => prop.fk.table);

        console.log("fkTablesToFetch: ", fkTablesToFetch);

        for (const fkTable of new Set(fkTablesToFetch)) {
          supabase.from(fkTable).select("*").then((r: { data: any, error: any }) => {
            const options = r.data.map(d => ({id: d.id, title: d.name || d.title || d.label || d.email || d.id || d}));
            console.log('adding to selectors: ', fkTable, options);
            selectors.value[fkTable] = options;
            // console.log('selectors now after ', fkTable, ': ', selectors.value);
          });
        }

      });

}
applyTable();

watch(
    () => router.currentRoute.value.params,
    () => applyTable());


const cellToString = (row: any, column: any) => {
  const colName = (column.isFk && !!column.fk.fk_name) ? column.fk.fk_name : column.name;
  // const colName = column.name;
  const cell = row[colName];
  console.log('cell for row:', row, ' column:', column, ', colName: ', colName, ' cell: ', cell);
  return !cell ? '' : (cell.handle || cell.name || cell.email || cell.id || cell);
};

const upcaseFirst = (s: string) => s.substring(0, 1).toUpperCase() + s.substring(1);

const cellTitle = (column: any) => {
  let colName = column.name;
  if (colName.endsWith("_id"))
    colName = column.name.substring(0, column.name.length - "_id".length);
  colName = colName.replaceAll('_', ' ');
  if (colName.startsWith('has') || colName.startsWith('is'))
    colName += "?";
  return upcaseFirst(colName);
};

const pluralize = (s: string) => s.endsWith("s") ? s : s + "s";

const toPluralTitle = (s: string) => upcaseFirst(pluralize(s));

const handleCreate = (args: any) => {
  const tableName = router.currentRoute.value.params.name;
  console.log('create: ', JSON.stringify(newObject.value));
  // noinspection JSVoidFunctionReturnValueUsed,TypeScriptValidateJSTypes
  supabase.from(tableName).insert([newObject.value])
      .then((x: any) => {
        console.log('response: ', x);
        if (x.error) throw x.error;
        applyTable();
      }).catch((err: any) => alert(err.message));
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
}

const getOptions = (prop: any) => {
  console.log('options for ', prop.name, selectors, selectors[prop.name]);
  return [1, 2, 3].map(i => ({
    id: "id_" + i,
    title: "value number " + i,
  }));
}

</script>
<template>

  <div>
    <h2>{{ toPluralTitle(tableName) }}</h2>
    <table>
      <thead>
      <tr>
        <th v-for="column in tableColumns">
          {{ cellTitle(column) }}
        </th>
      </tr>
      </thead>
      <tbody>
      <!--        <tr v-for="row of data">-->
      <!--          <td colspan="99">{{ row }}</td>-->
      <!--        </tr>-->
      <tr v-for="row of data">
        <td v-for="column of tableColumns">
          {{ cellToString(row, column) }}
        </td>
        <td>
          <button @click="deleteRow(row.id)">DELETE</button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <div>
    <form @submit.prevent="handleCreate">
      <fieldset>
        <legend>Create new {{ tableName }}</legend>
        <label v-for="field of editableColumns">
          <!--          <pre>{{field}}</pre>-->
          {{ cellTitle(field) }}

          <input v-if="field.type === 'boolean'" 
                 type="checkbox"/>

          <input v-else-if="!field.isFk" 
                 v-model="newObject[field.name]"
                 v-bind:placeholder="field.name"
                 name="field.name"
          />

          <select v-if="field.isFk" v-model="newObject[field.name]">
            <option v-for="o of selectors[field.fk.table]" :key="o.id" :value="o.id">{{ o.title }}</option>
          </select>


        </label>
        <input type="submit">
      </fieldset>
    </form>
  </div>

</template>

<style>
form {
  max-width: inherit;
  margin-top: 3em;
}
</style>
