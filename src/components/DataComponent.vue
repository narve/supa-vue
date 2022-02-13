<script setup lang="ts">

import {fetchDataAsync, supabase} from "../supa";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";
import {Definitions} from "../supa/SupaTypes";
import {KVP} from "../supa/supa-openapi";

const tableName = ref('...')

const router = useRouter();

const newObject = ref({} as any);

const data = ref([] as any[]);
const columns = ref<string[]>([]);
const editableColumns = ref<any[]>([]);
const tableColumns = ref<string[]>([]);

const selectors = ref({} as any);

const applyTable = () => {
  tableName.value = router.currentRoute.value.params.name as string;
  console.log('fetching: ', tableName.value);
  const tName: keyof Definitions = <keyof Definitions>tableName.value;
  fetchDataAsync(supabase, tName)
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
            const options = r.data.map((d: any) => ({
              id: d.id,
              title: d.name || d.title || d.label || d.email || d.id || d
            }));
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

const handleCreate = () => {
  const tableName = router.currentRoute.value.params.name as string;
  console.log('create: ', JSON.stringify(newObject.value));
  // noinspection JSVoidFunctionReturnValueUsed,TypeScriptValidateJSTypes
  supabase.from(tableName).insert([newObject.value])
      .then((x: any) => {
        console.log('response: ', x);
        if (x.error) throw x.error;
        applyTable();
      }, (err: any) => alert(err.message));
}

const deleteRow = (id: string) => {
  console.log('should delete: ', id);
  const tableName = router.currentRoute.value.params.name as string;
  supabase.from(tableName).delete().eq('id', id)
      .then((x: any) => {
        console.log('response: ', x);
        if (x.error) throw x.error;
        applyTable();
      }, (err: any) => alert(err.message));
}


// --- REFACTORING: 

// OpenAPI

// data:Ref<any> is OpenAPI spec
// tableName is name of relation/definition


const currentItem = ref(null as any);

const allProps = ref(null as any);
const editableProps = ref([] as KVP[]);

const edit = async (item: any) => {
  console.log('Now editing: ', item);
  currentItem.value = Object.assign({}, item);
}

const save = async () => {
  const user = supabase.auth.user();
  console.log('create new', {user}, JSON.stringify(currentItem.value, null, ' '));
  // item.value.owner_id ||= user?.id; handled by database :) 
  const {error, data} = await supabase.from("orderline").upsert(currentItem.value);
  if (error) {
    console.error(error.message);
    alert('Error: ' + error.message);
  } else {
    console.log("Saved: ", {data});
    currentItem.value = null;
    // await refresh();
  }
};

const remove = async (item: any) => {
  console.log('remove', item);
  const {error, data} = await supabase.from("orderline").delete().eq('id', item.id);
  if (error) console.error(error);
  else {
    console.log(data);
    currentItem.value = null;
    // await refresh();
    // await fetchStatistics();
  }
}

</script>
<template>

  <div>
    <button @click="currentItem = {}">Registrer ny </button>
  </div>
  
  <div v-if="currentItem">
    <p>currentItem: {{currentItem}}</p>
    <p>editableColumns: {{editableColumns}}</p>
    <div v-for="prop of editableColumns">
      <label :for="'input_'+prop">{{prop.name}}</label>
      <input id="'input_'+prop" :placeholder="prop.name">
    </div>
    <div>
      <button @click="currentItem = null" >
        Avbryt
      </button>
      <button v-if="currentItem.id" @click="save(currentItem)" >
        Oppdater
      </button>
      <button v-if="currentItem.id" @click="remove(currentItem)" >
        Slett
      </button>
      <button v-if="!currentItem.id" @click="save(currentItem)" >
        Registrer
      </button>
    </div>
  </div>
  
  
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
          <button @click.prevent="edit(row)"><i class="material-icons">edit</i></button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>

  <div v-if="false">
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
