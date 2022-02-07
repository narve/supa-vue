<script lang="ts">

import {ref} from "vue";

const data = ref([]);
const newItem = ref([]);

const createNew = (args: any) => {
  console.log('create new', args);
};

const refresh = (args?: any) => {
  console.log('refresh');
}

const remove = (args?: any) => {
  console.log('remove');
}

await refresh();

export default {
  methods() {
    return {
      createNew,
      refresh,
    }
  },
  setup() {
    return {
      data, newItem
    };
  }, 
  name: 'Bestillinger',
  path: '/orderline'
}
</script>

<template>
  <h2>Bestillinger</h2>

  <form  @submit.prevent="createNew">
    <fieldset>
      <legend>Registrer ny bestilling</legend>
      <label>Kundens navn: </label>
      <input v-model="newItem['name']">
      <input type="submit">
    </fieldset>
  </form>

  <table>
    <thead>
    <tr>
      <th>Navn</th>
      <th>Addresse</th>
      <th>Antall</th>
      <th>Notat</th>
      <th>Å betale</th>
      <th>Handlinger</th>
    </tr>
    </thead>
    <tbody>
    <tr>
      <td>1</td>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <th colspan="99">
        Totalt:
      </th>
    </tr>
    </tfoot>
  </table>

</template>
