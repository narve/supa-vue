<script setup lang="ts">

import {onBeforeMount, ref} from "vue";
import {supabase} from "../supa";
import {KVP, toKVP} from "../supa/supa-openapi";

const paths = ref([] as KVP[]);
const getPaths = ref([] as KVP[]);
const items = ref(['hei'] as any[]);
const api = ref({} as any);


const output = (obj: any) => JSON.stringify(obj, null, ' ');

const fetchOpenApi = async () => {

  // const toInclude = [
  //   'question', 'answer', 'student'
  // ]

  const {data} = await supabase.from('').select() as any;
  console.log(data);
  api.value = data;
  items.value = toKVP(data.definitions);
  paths.value = toKVP(data.paths)
  getPaths.value = paths.value
      .filter(kvp => kvp.value['get'])
      .filter(kvp => kvp.name !== '/')
      // .filter(kvp => toInclude.includes(kvp.name.substring(1)))
  // .filter(kvp => kvp.value.)



  ;
};

onBeforeMount(async () => {
  await fetchOpenApi();
});



const getSchemaRef = (kvp:KVP) => kvp.value['get']['responses']['200']['schema']['items']['$ref'];

const getDefinition = (api:any, schemaRef:string) => {
  const name = schemaRef.substring("#/definitions/".length);
  return api.definitions[name];
}
</script>

<template>
  <h1>Data-types</h1>
  <div v-for="kvp in getPaths">
<!--    {{ kvp.name }} => {{output(kvp.name) }}-->
    <router-link :to="'/api' + kvp.name">
      {{ getDefinition(api, getSchemaRef(kvp))?.description || kvp.name.substring(1)}}
<!--      := {{kvp.value.description}}-->
    </router-link>
<!--    <pre>{{ getSchemaRef(kvp)}}</pre>-->
<!--    <pre>{{ getDefinition(api, getSchemaRef(kvp))}}</pre>-->
  </div>

<!--  <pre>{{ output(api) }}</pre>-->
</template>


<style scoped>

</style>
