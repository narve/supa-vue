<script setup lang="ts">

import {fetchDataAsync, supabase} from "../../supa";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";
import {Definitions} from "../../supa/SupaTypes";
import {store} from "../../supa/store";

const router = useRouter();

const tableName = ref('...')
const data = ref([] as any[]);
const columns = ref<string[]>([]);
const editableColumns = ref<any[]>([]);
const tableColumns = ref<string[]>([]);
const canAdd = ref(false);
const canEdit = ref(false);

const currentItem = ref(null as any);

const selectors = ref({} as any);

const refreshList = async () => {
  tableName.value = router.currentRoute.value.params.name as string;
  console.log('fetching: ', tableName.value);
  const tName: keyof Definitions = <keyof Definitions>tableName.value;

  fetchDataAsync(supabase, tName)
      .then((x: any) => {
        console.log('meta: ', x.meta);

        const paths = x.openApi.paths;
        const tablePath = "/" + tName;
        canAdd.value = !!paths[tablePath].post
        canEdit.value = !!paths[tablePath].put || !!paths[tablePath].patch
        // canAdd.value = meta.


        data.value = x.data;
        columns.value = Object.keys(x.meta.properties);

        editableColumns.value = columns.value
            .map(c => x.meta.properties[c])
            .filter(c => !c.isPk)

        tableColumns.value = columns.value
            .map(c => x.meta.properties[c])
            .filter(c => !c.isPk);

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
          });
        }
      });
}

refreshList();

watch(
    () => router.currentRoute.value.params,
    () => refreshList());


const cellToString = (row: any, column: any) => {
  const colName = (column.isFk && !!column.fk.fk_name) ? column.fk.fk_name : column.name;

  const cell = row[colName];
  // console.log('cell for row:', row, ' column:', column, ', colName: ', colName, ' cell: ', cell);

  if (column.type === 'boolean') {
    return cell ? 'YES' : 'NO'
  } else if (column.type === 'string') {
    return (cell === null || cell === undefined) ? '' : (cell.handle || cell.name || cell.email || cell.id || cell);
  } else {
    const stringVal = (cell === null || cell === undefined) ? '' : (cell.handle || cell.name || cell.email || cell.id || cell);
    return `(${JSON.stringify(column)}) ${stringVal}`
  }
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

const edit = async (item: any) => {
  console.log('Now editing: ', item);
  const o: any = {id: item.id}
  for (const p of editableColumns.value) {
    o[p.name] = item[p.name]
  }
  currentItem.value = o
}

const save = async () => {
  const user = store.session!.user;
  console.log('create new', {user}, JSON.stringify(currentItem.value, null, ' '));
  const {error, data} = await supabase.from(tableName.value).upsert(currentItem.value);
  if (error) {
    console.error(error.message);
    alert('Error: ' + error.message);
  } else {
    console.log("Saved: ", {data});
    currentItem.value = null;
    await refreshList();
  }
};

const remove = async (item: any) => {
  console.log('remove', item);
  const {error, data} = await supabase.from(tableName.value).delete().eq('id', item.id);
  if (error) console.error(error);
  else {
    console.log(data);
    currentItem.value = null;
    await refreshList();
  }
}

const startNew = () => {
  currentItem.value = {}
}

</script>
<template>

  <div>
    <button @click="startNew" v-if="canAdd">Registrer ny</button>
  </div>


  <div v-if="currentItem">
    <form>
      <fieldset>
        <legend v-if="!currentItem.id">Opprett ny</legend>
        <legend v-if="currentItem.id">Oppdater</legend>
        <label v-for="field of editableColumns">
          <!--                              <pre>{{field}}</pre>-->
          {{ cellTitle(field) }}:

          <input v-if="field.type === 'boolean'"
                 type="checkbox"
          />

          <input v-if="field.type === 'number' && !field.isFk"
                 v-bind:placeholder="field.name"
                 type="number"
          />

          <textarea v-if="field.type === 'string' && field.maxLength > 64"
                    v-model="currentItem[field.name]"
                    v-bind:placeholder="field.name"
                    name="field.name"
          ></textarea>

          <select v-if="field.isFk" v-model="currentItem[field.name]">
            <option v-for="o of selectors[field.fk.table]" :key="o.id" :value="o.id">{{ o.title }}</option>
          </select>

          <input v-else-if="!field.isFk"
                 v-model="currentItem[field.name]"
                 v-bind:placeholder="field.name"
                 name="field.name"
          />

        </label>
        <div>
          <button @click="currentItem = null">
            Avbryt
          </button>
          <button v-if="currentItem?.id" @click="save()">
            Oppdater
          </button>
          <button v-if="currentItem?.id" @click="remove(currentItem)">
            Slett
          </button>
          <button v-if="!currentItem?.id" @click="save()">
            Registrer
          </button>
        </div>
      </fieldset>
    </form>
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
          <button v-if="canEdit" @click.prevent="edit(row)"><i class="material-icons">edit</i></button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>


</template>

<style>
form {
  max-width: inherit;
  margin-top: 3em;
}
</style>
