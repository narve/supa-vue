<script lang="ts">

import {ref} from "vue";

const data = ref([]);
const newItem = ref({});

const createNew = (args: any) => {
  console.log('create new', JSON.stringify(newItem.value, null, ' '));
};

const refresh = (args?: any) => {
  console.log('refresh');
}

const remove = (args?: any) => {
  console.log('remove');
}

await refresh();

export default {
  methods: {
    // return {
    async createNew(args: any) {
      await createNew(args);
    },
    async refresh(args: any) {
      await refresh(args);
    },
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

<style>
/*label span {min-width: 10em; display: inline-block; }*/
/*fieldset label input {*/
/*}*/

label {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}

label > input {
  width: 200px;
}

</style>

<template>
  <h2>Bestillinger</h2>

  <form @submit.prevent="createNew">
    <fieldset>
      <legend>Registrer ny bestilling</legend>
      <div>
        <label>Navn:</label>
        <input v-model="newItem['name']">
      </div>
      <label>
        <span>Navn:</span>
        <input v-model="newItem['name']">
      </label>
      <label>Adresse:
        <input v-model="newItem['address']">
      </label>
      <label>Antall:
        <input type="number" v-model="newItem['number_of_items']">
      </label>
      <label>Kommentarer:
        <input v-model="newItem['name']">
      </label>
      <input type="submit" value="Registrer">
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
