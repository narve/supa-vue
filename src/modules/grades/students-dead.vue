<script setup lang="ts">

import {onMounted, ref} from 'vue';
import {supabase} from "../../supa";

const items = ref([] as any[]);
const newStudent = ref({})

const fetchData = async () => {
  const {data, error} = await supabase.from('student').select();
  items.value = data as any[];
  if (error)
    console.log('error fetching: ', error);
}


const addStudent = async () => {
  console.log('add student: ', newStudent.value)
  await supabase.from('student').insert({name: newStudent.value})
  await fetchData()
  return false;
}



onMounted( () => {
  console.log('mounted students!');
  fetchData();
  newStudent.value = {}
})


</script>

<template>

  <h1>Elever2</h1>

<!--  <button @click="fetchData">FETCH</button>-->

  <ul>
    <li v-for="item of items" :key="item">
      <router-link :to="`/grades/student/${item.id}`">
        {{ item.name }}
      </router-link>
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

