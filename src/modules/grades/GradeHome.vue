<script setup lang="ts">
import {standardEmits} from "../../utils/standardEmits";
import {computed, ref, watch} from "vue";
import DataComponent from "../api/DataComponent.vue";
import {router} from "../../main";
// import DataComponent from "../api/DataComponent.vue";

const emit = defineEmits(standardEmits)

const links = (o: any) => [
  {href: `/api/question?questionnaire_id=${o.id}`, title: 'Spørsmål'},
  // {href: `questions?questionnaire_id=${o.id}`, title: 'Spørsmål'},
  {href: `/grades/report?questionnaire_id=${o.id}`, title: 'Oversikt'},
  {href: `/grades/questionnaire-table?questionnaire_id=${o.id}`, title: 'Tabellvisning'},
]

const qid = computed(() => router.currentRoute.value.query['questionnaire_id'])

const panels = ref([{
  id: 'questionnaires',
  name: 'Prøver',
  active: true,
}, {
  id: 'students',
  name: 'Elever',
  active: false,
}])

const activatePanel = (id: string) => {
  panels.value.forEach(p => p.active = false)
  const p = panels.value.find(p => p.id === id)
  p!.active = true
  console.log('activated: ', p)
}

</script>
<template>

  <h1>Prøvehåndtering</h1>
<!--  <p>{{qid}}</p>-->

  <nav class="module">
    <button v-for="panel of panels" @click.prevent="activatePanel(panel.id)">{{ panel.name }}</button>
  </nav>

<!--  <nav class="module">-->
<!--    <router-link :to="{name: 'questionnaires', props: {tableName: 'questionnaires'}}">-->
<!--      Prøver-->
<!--    </router-link>-->
<!--    <router-link :to="{name: 'students', props: {tableName: 'questionnaires'}}">-->
<!--      Studenter-->
<!--    </router-link>-->
<!--  </nav>-->

  <div class="panel"
       v-for="panel of panels.filter(p => p.id==='questionnaires')"
       :class="{active: panel.active}">
    <data-component
        tableName='questionnaire'
        :links="links"
    >
    </data-component>
  </div>

  <div class="panel"
       v-for="panel of panels.filter(p => p.id==='students')"
       :class="{active: panel.active}">
    <data-component
        tableName='student'
    >
    </data-component>
  </div>

  <router-view
      @startloading="(args) => emit('startloading', args)"
      @doneloading="() => emit('doneloading', args)"
      @error="(args) => emit('error', args)"
  ></router-view>

</template>

<style>
div.panel {
  display: none;
}

div.active {
  display: block;
}
</style>