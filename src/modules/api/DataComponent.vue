<script setup lang="ts">

import {fetchDataAsync, supabase} from "../../supa";
import {useRouter} from "vue-router";
import {ref, watch} from "vue";
import {Definitions} from "../../supa/SupaTypes";
import {store} from "../../supa/store";
import ItemEditor from "./ItemEditor.vue";
import {cellTitle, toPluralTitle} from "./util";

const router = useRouter();

interface Link {
  href: string;
  displayName: string;

}

interface Props {
  columns?: string;
  tableName?: string;
  links?: (o: any) => Link[]
}

const props = withDefaults(
    defineProps<Props>(),
    {
      columns: 'a',
      links: undefined, //() => []
    })

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
  tableName.value =
      props.tableName ||
      router.currentRoute.value.params.name as string;
  console.log('fetching: ', tableName.value);
  const tName: keyof Definitions = <keyof Definitions>tableName.value;

  fetchDataAsync(supabase, tName)
      .then((x: any) => {
        console.log('meta: ', x.meta);

        const paths = x.openApi.paths;
        const tablePath = "/" + tName;
        canAdd.value = !!paths[tablePath].post
        canEdit.value = !!paths[tablePath].put || !!paths[tablePath].patch

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
    // noinspection UnnecessaryLocalVariableJS
    const stringVal = (cell === null || cell === undefined) ? '' : (cell.handle || cell.name || cell.email || cell.id || cell);
    // return `(${JSON.stringify(column)}) ${stringVal}`
    return stringVal
  }
};

const edit = async (item: any) => {
  // console.log('Now editing: ', item);
  currentItem.value = JSON.parse(JSON.stringify(item))
}

const save = async () => {
  const user = store.session!.user;
  console.log('Save', {user}, JSON.stringify(currentItem.value, null, ' '));
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

const remove = async () => {
  console.log('remove', currentItem);
  if (!currentItem.value.id) {
    throw new Error('trying to remove non-saved item!', currentItem.value)
  }
  const {error, data} = await supabase.from(tableName.value).delete().eq('id', currentItem.value.id);
  if (error) console.error(error);
  else {
    console.log(data);
    currentItem.value = null;
    await refreshList();
  }
}

const getLinks = (item: any) => props.links ? props.links(item) : []

const startNew = () => {
  currentItem.value = {}
}

</script>
<template>

  <div>
    <button @click="startNew" v-if="canAdd && currentItem == null">Registrer ny</button>
  </div>

  <!--  <p>Selectors: {{selectors}}</p>-->

  <ItemEditor v-if="currentItem"
              :item="currentItem"
              :editableColumns="editableColumns"
              :selectors="selectors"
              @cancel="() => currentItem=null"
              @save="() => save()"
              @remove="() => remove()"
  >
  </ItemEditor>

  <div>
    <h2>{{ toPluralTitle(tableName) }}</h2>
    <table>
      <thead>
      <tr>
        <th v-for="column in tableColumns">
          {{ cellTitle(column) }}
        </th>
        <th v-if="props.links">Lenker</th>
        <th>&nbsp;</th>
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
        <td v-if="props.links">
          <a v-for="l of getLinks(row)" :href="l.href">{{l.title}}</a>
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
