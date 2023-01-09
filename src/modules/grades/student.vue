<template>

  <h1>Student no {{ id }}: {{ item.name }}</h1>
  <button @click="fetch()">FETCH/RELOAD</button>

  <button @click="fetch()">(Last data på nytt)</button>

  <h2>{{ item.name }}</h2>

  <form>
    <label>Elevens navn (hvis det skal endres!)
    </label>
    <input v-model="item.name">

    <label>Kommentar på prøven: </label>
    <textarea v-model="item.comments"></textarea>
  </form>

  <table>
    <thead>
    <tr>
      <th>Id</th>
      <th>Oppgave</th>
      <th>Maks poeng</th>
      <th>Elvens poeng</th>
      <th>Kommentar</th>
      <th></th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="q in questions" :key="q.id">
      <td>{{ q.id }}</td>
      <td>{{ q.name }}</td>
      <td>{{ q.points }}</td>

      <td>
        <input name="points" v-model="q.answer.points" type="number" :max="q.points" :min="0">
      </td>
      <td>
        <input name="comments" v-model="q.answer.comments">
      </td>
    </tr>
    </tbody>
  </table>


  <div>
    <label>Lagre</label>
    <input type="submit" value="Lagre" @click.prevent="save">
  </div>

</template>

<script lang="ts" setup>

import {ref} from 'vue';
import {supabase} from "../../supa";
import {router} from "../../main";

const items = ref([] as any[]);
const item = ref({} as any);
// const answers = ref([] as any[]);
const questions = ref([] as any[]);

const id = router.currentRoute.value.params.id

const fetch = async () => {
  const {data, error} = await supabase.from('student').select().match({id});
  items.value = data as any[];
  console.log('items: ', items.value)
  item.value = items.value[0];
  if (error)
    console.log('error fetching: ', error);

  const {data: _questions} = await supabase.from('question').select().order('id')
  const quest = _questions as any[]

  const {data: _answers} = await supabase.from('answer').select().match({student_id: id})
  const ans = _answers as any[]

  for (const q of (quest as any[])) {
    const a = ans.find((x: any) => x.question_id == q.id)
    q.answer = a || {question_id: q.id, points: 0, comments: '', student_id: item.value.id}
    // console.log('q with a: ', q)
  }

  questions.value = quest;
  // answers.value = ans!;

}

fetch();


const save = async () => {
  await supabase.from('student').update({name: item.value.name, comments: item.value.comments})
      .match({id: item.value.id})

  const toInsert = questions.value.map(qa => qa.answer).filter(a => !a.id)
  await supabase.from('answer').insert(toInsert)

  const toUpdate = questions.value.map(qa => qa.answer).filter(a => !!a.id)
  for (const u of toUpdate) {
    await supabase.from('answer').update(u).match({id: u.id})
  }

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