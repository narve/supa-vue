<template>

        <h2>Rapport</h2>

          <button @click="fetch()">FETCH/RELOAD</button>
      <button @click="printIt">PRINT</button>


      <div class="screen" style="display: none">
        <textarea id="csv">OppgaveTittel,Daniel,Noah,Abdu,Rasmuss,Aleksander,Henrik,Matilde B.,Mathilde S. H. ,Sara,Jenny,Karsten,Lise,Ole,Christian August,Magnus,Lilly,Vemund,Sol,Fillip,Oliver,Mathias
Oppgave 1,2,1.5,2,1.5,2,2,1.5,1.5,1.5,1.5,0,2,1.5,0,0,1.5,1.5,1.5,1.5,0.5,0
Oppgave 2,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1
Oppgave 3,1,1,1,1,1,0,1,1,0,1,0,0,1,1,0,0,0,0,0,1,1
Oppgave 4,1,0,0.5,1,1,1,0,1,0,1,1,1,0,1,1,0,1,0,0,1,0
Oppgave 5,1,0,1,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,0,1
Oppgave 6,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1
Oppgave 7,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,0
Oppgave 8,0,0,1,1,1,0,0,0,0,0,1,0,1,1,0,0,1,1,1,0,1
Oppgave 9a,0.5,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1
Oppgave 9b,2,2,2,2,2,1,1.5,2,1,2,0,1,2,2,2,1,2,2,2,1.5,2
Oppgave 9c,1,1,1,1,1,1,1,1,1,4,1,4,1,1,1,1,1,1,0,0,1
Oppgave 10a,4,1.5,2,2,4,0,2,4,0.5,2,4,3,3,4,2.5,4,4,2,1,1,2
Oppgave 10b,2,1,1,2,2,2,2,2,0.5,0.5,2,2,2,2,2,2,2,2,0.5,2,2
Oppgave 11,1.5,2,2,2,2,2,2,0,0,2,2,1,2,1,1.5,2,2,2,1.5,1,2
Oppgave 12a,2,3,3,3,3,2,3,3,1,1.5,2,3,3,3,3,3,3,3,0,1.5,2
Oppgave 12b,0.5,1.5,2,2,2,2,1.5,2,2,1,0.5,2,2,2,2,2,2,2,0,,0
Oppgave 12c,0.5,0.5,1,1,1,1,1,1,0,1,0.5,1,1,0,1,1,1,1,0,,0.5
Oppgave 12d,0.5,1,1,1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1
Oppgave 12e,1,0.5,1,0,0.5,4,0.5,1,0.5,1,1,1,1,1,1,1,1,0.5,1,1,1
Oppgave 14,4,4,4,4,4,4,4,4,0.5,3.5,2,4,4,4,4,4,4,4,1,2,4
Oppgave 15,0,2.5,3,3,3,0,2,3,0,2,2,3,3,2.5,3,1.5,2,3,1,0,2</textarea>
        <input type="submit" @click="importCsv">
      </div>


      <div id="toprint">
        <div class="page" v-for="s of students" :key="s.id">
          <h1>Elev: {{ s.name }}</h1>

          <table border="1">
            <thead>
            <tr>
              <th>Oppgave</th>
              <th>Maks Poeng</th>
              <!--            <th>Kommentar</th>-->
              <th>Elevens poeng</th>
              <!--            <th>Kommentar</th>-->
            </tr>
            </thead>
            <tbody>
            <tr v-for="q of questions" :key="q.id">
              <!--            <th>{{ q.id }}</th>-->
              <td>{{ q.name }}</td>
              <td>{{ q.points }}</td>
              <!--            <td>{{ q.comments }}</td>-->
              <td>
                {{ answer(s.id, q.id).points }}
              </td>
              <!--            <td> &nbsp;-->
              <!--              {{ answer(s.id, q.id).comments }}-->
              <!--            </td>-->
            </tr>

            </tbody>
          </table>

          <p>Totalt antall mulige poeng: {{ totalPoints }}</p>
          <p>Elevens poeng: {{ totalPointsForStudent(s.id) }}</p>

        </div>

        <!--  {{ students }}-->
      </div>

</template>

<script lang="ts" setup>

import {ref} from 'vue';
import {supabase} from "../../supa";
// import {supabase} from '';

const students = ref([] as any[]);
const questions = ref([] as any[]);

const totalPoints = ref(0)
const totalPointsForStudent = (id: number) => {
  const pa = students.value.find(s => s.id == id).answer.map((a: any) => a.points)
  let sum = 0
  for (let p of pa)
    sum += p

  return sum
}

const answer = (studentId: number, questionId: number) => {
  const student = students.value.find(s => s.id == studentId);
  const answer = student.answer.find((a: any) => a.question_id == questionId)
  return answer || {points: 0, comments: '(Ubesvart)'}
}

const fetch = async () => {
  const {data: _questions} = await supabase.from('question').select().order('id')
  questions.value = _questions as any[]
  const {data: _students, error: _studentsError} = await supabase.from('student')
      .select('*, answer(*)')
      .order('name');
  students.value = _students as any[];
  if (_studentsError)
    console.log('error fetching: ', _studentsError);

  totalPoints.value = questions.value.map(q => q.points).reduce((a, b) => a + b, 0)
}

fetch()

// window.onbeforeprint = () => setPrintStyles(true);
// window.onafterprint = () => setPrintStyles(false);

// const setPrintStyles = (add: boolean) => {
//   document.querySelectorAll('ion-content').forEach((element) => {
//     const scroll = element.shadowRoot!.querySelector('.inner-scroll') as HTMLElement;
//     if (add) {
//       scroll.style.position = 'relative';
//     } else {
//       scroll.style.removeProperty('position');
//     }
//   });
// }

const importCsv = async () => {
  const csv = document.querySelector('#csv').textContent.trim()
  const lines = csv.split('\n')

  const studentNames = lines[0].split(',').map(s => s.trim()).slice(1)

  console.log('student names: ', studentNames)

  for (const line of lines.slice(1)) {
    console.log('line: ', line)
    const items = line.split(',')
    const questionName = items[0].slice('Oppgave '.length)
    const grades = items.slice(1)
    const question = questions.value.find((q: any) => q.name == questionName)

    studentNames.forEach((name, index) => {
      if (index >= 0) {
        const student = students.value.find((s: any) => s.name == name)
        const gradeString = grades[index]
        const grade = gradeString ? parseFloat(gradeString.trim()) : 0
        // if(!gradeString) 7


        if (!question || !student || isNaN(grade)) {
          console.log('Questionname: ', questionName, 'QuestionId: ', question?.id, 'student: ', '"' + name + '"', 'student id: ', student, 'gradeString: ', gradeString)
          throw new Error('ups!')
        }

        console.log('Questionname: ', questionName, 'QuestionId: ', question.id, 'student: ', name, 'student id: ', student.id, 'gradeString: ', gradeString)

        supabase.from('answer').insert({
          question_id: question.id,
          student_id: student.id,
          points: grade,
        }).then(x => console.log('saved: ', x))

      }
    })
  }
}

const printIt = () => {
  const element = document.getElementById('toprint');
  const opt = {
    margin:       1,
    filename:     'poeng.pdf',
    // image:        { type: 'jpeg', quality: 0.98 },
    // html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: {
      after: '.page'
    }
  };
  window.html2pdf().set(opt).from(element).save();
  // window.html2pdf(element);
}

</script>

<style scoped>
</style>