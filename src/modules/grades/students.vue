<template>

  <h1>Students</h1>

  <button @click="fetch()">FETCH</button>

  <ul>
    <li v-for="item of items" :key="item">
      <a :href="`/grades/student/${item.id}`">
        {{ item.name }}
      </a>
    </li>
  </ul>

  <form>
    <label>
      Navn:
      <input type="text" name="name" v-model="newStudent">

    </label>
    <input type="submit" placeholder="navn på elev" @click.prevent="addStudent" value="Legg til elev">
  </form>


</template>

<script lang="ts" setup>

import {ref} from 'vue';
import {supabase} from "../../supa";

const items = ref([] as any[]);

const fetch = async () => {
  const {data, error} = await supabase.from('student').select();
  items.value = data as any[];
  if (error)
    console.log('error fetching: ', error);
}

fetch();

const newStudent = ref('')

const addStudent = async () => {
  console.log('add student: ', newStudent.value)
  await supabase.from('student').insert({name: newStudent.value})
  await fetch()
  return false;
}

</script>

<style scoped>

</style>