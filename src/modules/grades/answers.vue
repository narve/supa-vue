<script setup lang="ts">

import {ref} from 'vue';
import {supabase} from "../../supa";
import {useRouter} from "vue-router";
import {standardEmits} from "../../utils/standardEmits";
import {PostgrestError} from "@supabase/supabase-js";


const debugObj = ref(undefined as any)
const emit = defineEmits(standardEmits)
const router = useRouter();

const questionnaire_id = router.currentRoute.value.query.questionnaire_id
const student_id = router.currentRoute.value.query.student_id

const blank = (question_id: number) => (
    {
      question_id,
      questionnaire_id,
      student_id,
      points: undefined,
      comments: ''
    }
)


const student = ref({} as any);
const questions = ref([] as any[]);

const error = ref(null as PostgrestError | null)

const fetch = async () => {
  emit('startloading', 'Henter student')
  ;({data: student.value, error: error.value} = await supabase
          .from('student')
          .select()
          .match({id: student_id})
          .single()
  )
  if (error.value) {
    emit('error', error.value)
    return
  }

  // const {data: _student, error: e1} = await supabase
  //     .from('student')
  //     .select()
  //     .match({id: student_id})
  //     .single()
  // student.value = _student;
  // if(e1) {
  //   emit('error', e1)
  //   return
  // }

  // throw Error('hei')

  emit('startloading', 'Henter spørsmål')
  const {data: _questions, error: e2} = await supabase
      .from('question')
      .select('*, answer2:answer_question_id_fkey(*)')
      .match({questionnaire_id})
      .order('name')
  if (e2) {
    emit('error', e2)
    return
  }

  for (const q of _questions) {
    if (!q.answer || q.answer.length == 0) q.answer = [blank(q.id)]
  }
  questions.value = _questions;
  debugObj.value = JSON.stringify(_questions, null, '   ')


  // emit('startloading', 'Henter besvarelse')
  // const {data: _answers, error: e3} = await supabase
  //     .from('answer')
  //     .select().match({student_id, questionnaire_id})
  // if (e3) {
  //   emit('error', e3)
  //   return
  // }

  // debugObj.value = _answers

  emit('doneloading')

  // questions.value = _questions;
  // for (const q of (questions.value)) {
  //   const a = _answers.find((x: any) => x.question_id == q.id)
  //   q.answer = a || blank(q.id)
  // }

}

fetch();


const save = async () => {
  emit('startloading', 'Oppdaterer student')
  await supabase
      .from('student')
      .update({name: student.value.name, comments: student.value.comments})
      .match({id: student.value.id})

  const toInsert = questions.value.map(qa => qa.answer)
      .filter(a => !a.id)
      .filter(a => !!a.points)
  emit('startloading', `Setter inn ${toInsert.length} nye svar`)
  await supabase.from('answer').insert(toInsert)

  const toUpdate = questions.value.map(qa => qa.answer).filter(a => !!a.id)
  emit('startloading', `Oppdaterer ${toInsert.length} svar`)
  for (const u of toUpdate) {
    await supabase.from('answer').update(u).match({id: u.id})
  }
  emit('doneloading')
}

</script>


<template>

  <h1>Student no {{ student_id }}: {{ student.name }}</h1>

  <div v-if="debugObj">
    <p>
      <button @click="fetch()">(Last data på nytt)</button>
    </p>
    <pre>
      {{ debugObj }}
    </pre>
  </div>

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
    <tr v-for="q of questions" :key="q.id">
      <td>{{ q.id }}</td>
      <td>{{ q.name }}</td>
      <td>{{ q.points }}</td>

      <td>
<!--        {{ q.answer }}-->
        <input name="points" v-model="q.answer[0].points" type="number" :max="q.points" :min="0">
      </td>
      <td>
        <input name="comments" v-model="q.answer[0].comments">
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