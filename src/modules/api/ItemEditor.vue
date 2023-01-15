<script setup lang="ts">

import {cellTitle} from "./util";
import {ref} from "vue";

interface Props {
  item: any,
  editableProps: any[],
  selectors: any,
}

const props = defineProps<Props>()
const emit = defineEmits(['cancel', 'save', 'remove'])

const {item, editableProps, selectors} = props

const devMode = ref(false)
const toggleDev = () => devMode.value = !devMode.value

</script>
<template>

<!--  <p>{{ editableProps }}</p>-->

<!--  <p>Selectors: {{selectors}}</p>-->

  <form @submit.prevent>
    <fieldset>
      <legend v-if="!item.id">Opprett ny</legend>
      <legend v-if="item.id">Oppdater</legend>
      <label v-for="field of editableProps">
        <!--                              <pre>{{field}}</pre>-->
        {{ cellTitle(field) }}:

        <input v-if="field.type === 'boolean'"
               v-on:keydown.enter.prevent
               type="checkbox"
        />

        <input v-if="field.type === 'number' && !field.isFk"
               v-on:keydown.enter.prevent
               v-bind:placeholder="field.name"
               type="number"
        />

        <textarea v-if="field.type === 'string' && field.maxLength > 64"
                  v-on:keydown.enter.prevent
                  v-model="item[field.name]"
                  v-bind:placeholder="field.name"
                  name="field.name"
        ></textarea>

        <select v-if="field.isFk" v-model="item[field.name]">
          v-on:keydown.enter.prevent
          <option v-for="o of selectors[field.fk.table]" :key="o.id" :value="o.id">{{ o.title }}</option>
        </select>

        <input v-else-if="!field.isFk"
               v-on:keydown.enter.prevent
               v-model="item[field.name]"
               v-bind:placeholder="field.name"
               name="field.name"
        />

      </label>

      <div v-if="devMode">
        {{item}}
      </div>

      <div>
        <button @click.prevent="emit('cancel')">
          Avbryt
        </button>
        <button v-if="item?.id" @click.prevent="emit('save')">
          Oppdater
        </button>
        <button v-if="!item?.id" @click.prevent="emit('save')">
          Registrer
        </button>
        <button v-if="item?.id" @click.prevent="emit('remove')">
          Slett
        </button>
        <button @click.prevent="toggleDev()">
          DEV
        </button>
      </div>
    </fieldset>
  </form>


</template>

<style>
form {
  max-width: inherit;
  margin-top: 3em;
}
</style>
