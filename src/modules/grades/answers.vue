<script setup lang="ts">

import {ref} from 'vue';
import {supabase} from "../../supa";
import {useRouter} from "vue-router";

const router = useRouter();
const questionnaire_id = router.currentRoute.value.query.questionnaire_id
const student_id = router.currentRoute.value.query.student_id
const blank = (question_id:number) => ({questionnaire_id, student_id, question_id, points: 0, comments: ''})

const answers = ref([] as any[]);
const student = ref({} as any);
const questions = ref([] as any[]);

const fetch = async () => {
  const {data, error} = await supabase.from('student').select().match({id: student_id});
  answers.value = data as any[];
  console.log('items: ', answers.value)
  student.value = answers.value[0];
  if (error)
    console.log('error fetching: ', error);

  const {data: _questions} = await supabase.from('question').select().order('id')
  const quest = _questions as any[]

  const {data: _answers} = await supabase.from('answer').select().match({student_id})
  const ans = _answers as any[]

  for (const q of (quest as any[])) {
    const a = ans.find((x: any) => x.question_id == q.id)
    q.answer = a || blank(q.id)
    // console.log('q with a: ', q)
  }

  questions.value = quest;
  // answers.value = ans!;

}

fetch();


const save = async () => {
  await supabase.from('student').update({name: student.value.name, comments: student.value.comments})
      .match({id: student.value.id})

  const toInsert = questions.value.map(qa => qa.answer).filter(a => !a.id)
  await supabase.from('answer').insert(toInsert)

  const toUpdate = questions.value.map(qa => qa.answer).filter(a => !!a.id)
  for (const u of toUpdate) {
    await supabase.from('answer').update(u).match({id: u.id})
  }

}

</script>


<template>

  <h1>Student no {{ student_id }}: {{ student.name }}</h1>
  <button @click="fetch()">FETCH/RELOAD</button>

  <button @click="fetch()">(Last data på nytt)</button>

  <h2>{{ student.name }}</h2>

  <form>
    <label>Elevens navn (hvis det skal endres!)
    </label>
    <input v-model="student.name">

    <label>Kommentar på prøven: </label>
    <textarea v-model="student.comments"></textarea>
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
    <button @click.prevent="save">Lagre</button>
  </div>

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