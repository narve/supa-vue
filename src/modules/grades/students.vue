<script setup lang="ts">

import {ref} from 'vue';
import {supabase} from "../../supa";

const items = ref([] as any[]);

const fetchData = async () => {
  const {data, error} = await supabase.from('student').select();
  items.value = data as any[];
  if (error)
    console.log('error fetching: ', error);
}

const newStudent = ref('')

const addStudent = async () => {
  console.log('add student: ', newStudent.value)
  await supabase.from('student').insert({name: newStudent.value})
  await fetchData()
  return false;
}


fetchData();

</script>

<template>

  <h1>Students</h1>

  <button @click="fetchData">FETCH</button>

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

