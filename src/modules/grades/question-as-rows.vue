<script setup lang="ts">

import {computed, ref, watch} from 'vue';
import {supabase} from "../../supa";
import {useRouter} from "vue-router";
import {standardEmits} from "../../utils/standardEmits";

import {AnswersInsert, AnswersRow, getOrThrow, QuestionsRow, StudentsRow} from "../../types/exports";

const debugObj = ref(undefined as any)
const emit = defineEmits(standardEmits)
const router = useRouter();

const q = computed(() => router.currentRoute.value.query.questionnaire_id)
const questionnaire_id = computed(() => parseInt(q.value![0]!.toString()))

function blank(student_id: StudentsRow, question_id: QuestionsRow): Partial<AnswersInsert> {
  return {
    question_id: question_id.id,
    questionnaire_id: questionnaire_id.value as number,
    student_id: student_id.id,
    points: undefined,
    comments: ''
  }
}

const mode = ref(true)

const questions = ref([] as QuestionsRow[]);
const students = ref([] as StudentsRow[]);
const answers = ref([] as AnswersRow[]);

const maxPoints = () => questions.value.map(c => c.points).reduce((a, b) => a + b, 0)
const totalPoints = (student_id: number) => answers.value
    .filter(a => a.student_id == student_id)
    .map(c => c.points).reduce((a, b) => a + b, 0)

const getAnswer = (student: StudentsRow, question: QuestionsRow) => {
  return answers.value
          .find(a => a.student_id == student.id && a.question_id == question.id)
      || blank(student, question)
}

const fetchData = async () => {
  emit('startloading', 'Henter elever')
  students.value = getOrThrow(await supabase.from('student')
          .select()
      // .match({questionnaire_id})
  )
  emit('startloading', 'Henter spørsmål')
  questions.value = getOrThrow(await supabase.from('question')
      .select()
      .match({questionnaire_id: questionnaire_id.value})
  )
  emit('startloading', 'Henter besvarelser')
  answers.value = getOrThrow(await supabase.from('answer')
      .select()
      .match({questionnaire_id: questionnaire_id.value})
  )

  emit('doneloading')

  // debugObj.value = cells.value
}


const save = async (answer: AnswersRow | Partial<AnswersInsert>, points: number) => {
  // console.log('save, points: ', points)
  // return
  if (answer.id) {
    emit('startloading', `Oppdaterer`)
    getOrThrow(await supabase.from('answer').update({points})
        .match({id: answer.id}))
  } else {
    emit('startloading', `Registerer`)
    answer.points = points
    getOrThrow(await supabase.from('answer').insert(answer as AnswersInsert))
  }
  emit('doneloading')
  await fetchData()
}

fetchData()

watch(
    () => router.currentRoute.value.query,
    () => {
      console.log('The matrix component: ', router.currentRoute.value.query)
      return fetchData();
    });


</script>

<template>

  <p>
    <button @click="mode = !mode">Bytt visningsmodus</button>
  </p>

  <table v-if="mode">
    <thead>
    <tr>
      <th>&nbsp;</th>
      <th>Maks poeng</th>
      <th v-for="student of students">
        {{ student.name }}
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="question of questions">
      <th>
        {{ question.name }}
      </th>
      <th>
        {{ question.points }}
      </th>
      <td v-for="student of students">
        {{ void (answer = getAnswer(student, question)) }}
        <span v-if="debugObj">[id: {{ answer.id || '(new)' }}]</span>
        <input
            type="number"
            v-model="answer.points"
            maxlength="question.points"
            @change="save(answer, $event.target.value)">
      </td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <th>Sum</th>
      <th>{{ maxPoints() }}</th>
      <td v-for="student of students">
        {{ totalPoints(student.id) }}
      </td>
    </tr>
    </tfoot>
  </table>

  <table v-if="!mode">
    <thead>
    <tr>
      <th>&nbsp;</th>
      <th v-for="question of questions">
        {{ question.name }}<br>({{ question.points }})
      </th>
      <th>
        Sum<br>
        ({{ maxPoints() }})
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="student of students">
      <th>
        {{ student.name }}
      </th>
      <td v-for="question of questions">
        <template v-for="answer in [getAnswer(student, question)]">
          <span v-if="debugObj">[id: {{ answer.id || '(new)' }}]</span>
          <input type="number" v-model="answer.points" @change="save(answer, $event.target.value)">
        </template>
      </td>
      <td>
        {{ totalPoints(student.id) }}
      </td>
    </tr>
    </tbody>
  </table>

  <div v-if="debugObj">
    <p>The data: </p>
    <pre>{{ debugObj }}</pre>
  </div>


</template>