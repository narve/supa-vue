<script setup lang="ts">

import {ref} from 'vue';
import {supabase} from "../../supa";
import {useRouter} from "vue-router";


const router = useRouter();
const questionnaire_id = router.currentRoute.value.params.questionnaire_id

const blank = () => (  {name: '', points: 0, comments: '', questionnaire_id})


const questions = ref([] as any[]);
const newItem = ref(blank())

const fetchData = async () => {
  const {data, error} = await supabase.from('question')
      .select()
      .match({questionnaire_id})

  questions.value = data as any[];
  if (error)
    console.log('error fetching: ', error);

}

fetchData()


const save = async () => {
  const toUpdate = questions.value
  console.log('save: ', toUpdate.length, !!newItem.value.name)
  for (const u of toUpdate) {
    await supabase.from('question').update(u).match({id: u.id})
  }

  if (newItem.value.name && newItem.value.points > 0) {
    await supabase.from('question').insert(newItem.value)
    newItem.value = blank()
  }

  await fetchData()

}

</script>

<template>

  <h2>Spørsmål</h2>
  <p>
    <button @click="fetchData">(Last data på nytt)</button>
  </p>

  <table>
    <thead>
    <tr>
<!--      <th>Id</th>-->
      <th>Oppgave</th>
      <th>Maks poeng</th>
      <th>Kommentar</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="q in questions" :key="q.id">
<!--      <th>{{ q.id }}</th>-->
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
      <th colspan="*">(Nytt spørsmål)</th>
    </tr>
    <tr>
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

  <p>New item: {{ newItem }}</p>

  <input type="submit" value="Lagre" @click.prevent="save">


</template>

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