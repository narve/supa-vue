<script setup lang="ts">

import {cellTitle} from "./util";

interface Props {
  item: any,
  editableColumns: any[],
  selectors: any,
}

const props = defineProps<Props>()
const emit = defineEmits(['cancel', 'save', 'remove'])

const {item, editableColumns, selectors} = props

</script>
<template>

<!--  <p>{{ editableColumns }}</p>-->

<!--  <p>Selectors: {{selectors}}</p>-->

  <form>
    <fieldset>
      <legend v-if="!item.id">Opprett ny</legend>
      <legend v-if="item.id">Oppdater</legend>
      <label v-for="field of editableColumns">
        <!--                              <pre>{{field}}</pre>-->
        {{ cellTitle(field) }}:

        <input v-if="field.type === 'boolean'"
               type="checkbox"
        />

        <input v-if="field.type === 'number' && !field.isFk"
               v-bind:placeholder="field.name"
               type="number"
        />

        <textarea v-if="field.type === 'string' && field.maxLength > 64"
                  v-model="item[field.name]"
                  v-bind:placeholder="field.name"
                  name="field.name"
        ></textarea>

        <select v-if="field.isFk" v-model="item[field.name]">
          <option v-for="o of selectors[field.fk.table]" :key="o.id" :value="o.id">{{ o.title }}</option>
        </select>

        <input v-else-if="!field.isFk"
               v-model="item[field.name]"
               v-bind:placeholder="field.name"
               name="field.name"
        />

      </label>
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
