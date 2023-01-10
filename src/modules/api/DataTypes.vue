<script setup lang="ts">

import {onBeforeMount, ref, toRefs} from "vue";
import {supabase} from "../../supa";
import {KVP, toKVP} from "../../supa/supa-openapi";

interface Props {
  dataTypes: string[]
}

const props = withDefaults(defineProps<Props>(),
    {dataTypes: () => []})


const {dataTypes} = toRefs(props)

console.log('props: ', props)

const paths = ref([] as KVP[]);
const getPaths = ref([] as KVP[]);
const items = ref(['hei'] as any[]);
const api = ref({} as any);

// const output = (obj: any) => JSON.stringify(obj, null, ' ');

const fetchOpenApi = async () => {
  const {data} = await supabase.from('').select() as any;
  api.value = data;
  items.value = toKVP(data.definitions);
  paths.value = toKVP(data.paths)
  console.log(paths.value.map(kvp => kvp.name));
  getPaths.value = paths.value
      .filter(kvp => kvp.value['get'])
      .filter(kvp => kvp.name !== '/')
      .filter(kvp => !dataTypes.value
          || dataTypes.value.length == 0
          || dataTypes.value.find(dt => '/' + dt == (kvp.name)))
};

onBeforeMount(async () => {
  await fetchOpenApi();
});


const getSchemaRef = (kvp: KVP) => kvp.value['get']['responses']['200']['schema']['items']['$ref'];

const getDefinition = (api: any, schemaRef: string) => {
  const name = schemaRef.substring("#/definitions/".length);
  return api.definitions[name];
}
</script>

<template>
  <h1>Data-types</h1>
  <p>Included: {{ dataTypes }}</p>
  <div v-for="kvp in getPaths">
    <router-link :to="'/api' + kvp.name">
      {{ getDefinition(api, getSchemaRef(kvp))?.description || kvp.name.substring(1) }}
    </router-link>
  </div>
</template>

