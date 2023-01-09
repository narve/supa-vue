<template>

  <h1>Students</h1>

      <button @click="fetch()">(Last data på nytt)</button>

      <h2>Spørsmål</h2>


      <table>
        <thead>
        <tr>
          <th>Id</th>
          <th>Oppgave</th>
          <th>Maks poeng</th>
          <th>Kommentar</th>
          <th></th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="q in questions" :key="q.id">
          <th>{{ q.id }}</th>
          <td>
            <input v-model="q.name">
          </td>
          <td>
            <input v-model="q.points" min="0" type="number">
          </td>
          <td>
            <input name="comments" v-model="q.comments">
          </td>
        </tr>
        <tr>
          <th>(Nytt spørsmål)</th>
          <td>
            <input v-model="newItem.name">
          </td>
          <td>
            <input v-model="newItem.points" min="0" type="number">
          </td>
          <td>
            <input name="newItem.comments" v-model="newItem.comments">
          </td>
        </tr>
        </tbody>
      </table>


      <input type="submit" value="Lagre" @click.prevent="save">


</template>

<script lang="ts" setup>

import {ref} from 'vue';
import {supabase} from "../../supa";

const questions = ref([] as any[]);
const newItem = ref({name:'', points: 0, comments: ''})

const fetch = async () => {
  const {data, error} = await supabase.from('question').select();
  questions.value = data as any[];
  if (error)
    console.log('error fetching: ', error);

}

fetch()


const save = async () => {
  // await supabase.from('student').update({name: item.value.name, comments: item.value.comments})
  //     .match({id: item.value.id})
  //
  // const toInsert = questions.value.map(qa => qa.answer).filter(a => !a.id)
  // await supabase.from('answer').insert(toInsert)
  //

  const toUpdate = questions.value
  for (const u of toUpdate) {
    await supabase.from('question').update(u).match({id: u.id})
  }

  if(newItem.value.name && newItem.value.points>0) {
    await supabase.from('question').insert(newItem.value)
    newItem.value = {name:'', points: 0, comments: ''}
  }

  await fetch()

}

</script>

<style scoped>

form label, form input, form textarea {
  display: block;
}

tr {
  padding: 1em;
}

th, td {
  padding: 2px;
  border: 1px black dot-dash;
}


table th {
  background: grey;
  font-weight: bold;
}

</style>