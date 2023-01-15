<script setup lang="ts">

import {getFatSelect, supabase} from "../../supa";
import {useRouter} from "vue-router";
import {onActivated, onMounted, ref, watch} from "vue";
import {store} from "../../supa/store";
import ItemEditor from "./ItemEditor.vue";
import {cellTitle, toPluralTitle} from "./util";
import {getOpenApi} from "../../supa/supa-openapi";
import {OpenApi, PropertyDef, RelationRef} from "../../supa/openapi-def";
import {standardEmits} from "../../utils/standardEmits";

const emit = defineEmits(standardEmits)

const router = useRouter();

interface Link {
  href: string;
  title: string;
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

const openApi = ref({} as OpenApi)
const tableDef = ref({} as RelationRef)


const tableName = ref('[tableName')
const tableTitle = ref('[tableTitle]' as any)
const data = ref([] as any[]);

const columns = ref<string[]>([]);

const editableProps = ref<PropertyDef[]>([]);
const tableColumns = ref<PropertyDef[]>([]);

const canAdd = ref(false);
const canEdit = ref(false);
const currentItem = ref(null as any);
const selectors = ref({} as any);

const filters = router.currentRoute.value.query
tableName.value = router.currentRoute.value.params['id'] as string

const debugObject = ref(null as any)

console.log('query: ', filters)

const refreshList = async () => {
  emit('startloading', 'Loading list')

  tableName.value =
      props.tableName ||
      router.currentRoute.value.params.name as string;
  console.log('fetching: ', tableName.value);

  // const tName: keyof Definitions = <keyof Definitions>tableName.value;
  const tName = tableName.value;

  openApi.value = await getOpenApi(supabase)
  const paths = openApi.value.paths;


  tableTitle.value = openApi.value.definitions[tName].description || toPluralTitle(tableName.value)
        const tablePath = "/" + tableName.value;
        // debugObject.value = {tablePath, paths}
        canAdd.value = !!paths[tablePath].post
        canEdit.value = !!paths[tablePath].put || !!paths[tablePath].patch

  const select = getFatSelect(openApi.value, tName)

  const {data: d, error: e} = await supabase
      .from(tName)
      .select(select)
      .match(filters)
  if(e) {
    emit('error', e)
    return
  }
  console.log({d, e})

  data.value = d as any[]

  tableDef.value = openApi.value.definitions[tName]
  columns.value = Object.keys(tableDef.value.properties);

  // tableDef.value.properties['a'].name

  editableProps.value = columns.value
      .map(c => tableDef.value.properties[c])
      .filter(c => !c.isPk)
      .filter(c => c.name != 'owner_id')

  tableColumns.value = editableProps.value

  const fkTablesToFetch = Object.keys(tableDef.value.properties)
      .map(propName => tableDef.value.properties[propName])
      .filter(prop => prop.isFk)
      .map(prop => prop.fk.table);

  console.log("fkTablesToFetch: ", fkTablesToFetch);

  for (const fkTable of new Set(fkTablesToFetch)) {
    supabase.from(fkTable)
        .select("*")
        .then((r: { data: any, error: any }) => {
          const options = r.data.map((d: any) => ({
            id: d.id,
            title: d.name || d.title || d.label || d.email || d.id || d
          }));
          console.log('adding to selectors: ', fkTable, options);
          selectors.value[fkTable] = options;
        });
  }
  emit('doneloading')
}


watch(
    () => router.currentRoute.value.params,
    () => refreshList());

onMounted(() => {
  console.log('Mounting: students ------------------------------ ')
  refreshList();
})

onActivated(() => {
  console.log('Activating: students ------------------------------ ')
  refreshList();

})

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

const blank = () => ({})

const edit = async (item: any) => {
  // console.log('Now editing: ', item);
  currentItem.value = blank()
  currentItem.value.id = item.id
  for (const p of editableProps.value) {
    currentItem.value[p.name] = item[p.name]
  }
}

const save = async () => {
  const user = store.session!.user;
  console.log('Save', {user}, JSON.stringify(currentItem.value, null, ' '));
  const {error, data} = await supabase.from(tableName.value).upsert(currentItem.value);
  if (error) {
    emit('error', error)
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
  currentItem.value = {...filters}
}

</script>
<template>

  <!--  <p>Selectors: {{selectors}}</p>-->

  <ItemEditor v-if="currentItem"
              :item="currentItem"
              :editableProps="editableProps"
              :selectors="selectors"
              @cancel="() => currentItem=null"
              @save="() => save()"
              @remove="() => remove()"
  >
  </ItemEditor>

  <div>
    <h2>{{ tableTitle }}</h2>
    <!--    <p>OpenApi: {{ openApi }}</p>-->
<!--    <p>Table def: {{ tableDef }}</p>-->
<!--    <p>Table columns: {{ tableColumns }}</p>-->
    <p v-if="debugObject">Debug: {{ debugObject }}</p>

    <div>
      <button @click="startNew" v-if="canAdd && currentItem == null">Registrer ny</button>
    </div>

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
          <a v-for="l of getLinks(row)" :href="l.href">{{ l.title }}</a>
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
