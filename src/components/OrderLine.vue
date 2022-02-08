<script lang="ts">

import {Ref, ref, UnwrapRef} from "vue";

import {supabase} from "../supa";

const items: Ref<UnwrapRef<any[]>> = ref([]);
const newItem: Ref<UnwrapRef<any>> = ref({});

const save = async () => {
  const user = supabase.auth.user();
  console.log('create new', {user}, JSON.stringify(newItem.value, null, ' '));
  newItem.value.owner_id = user?.id;
  const {error, data} = await supabase.from("orderline").insert(newItem.value);
  if (error) {
    console.error(error.message);
    alert('Error: ' + error.message);
  } else {
    console.log("Saved: ", {data});
    await refresh();
  }
};

const refresh = async () => {
  const user = supabase.auth.user();
  console.log('refresh', {user});
  const {error, data} = await supabase.from("orderline");
  if (error) console.error(error);
  else {
    console.log(data);
    if (data) {
      items.value = data;
      const sum = (items.value || []).map(s=>s.number_of_items).reduce((a,b) => a+b, 0);
      console.log( "sum: ", sum);
    }
  }
}

const remove = async (args?: any) => {
  console.log('remove', args);
  const {error, data} = await supabase.from("orderline").delete().eq('id', args);
  if (error) console.error(error);
  else {
    console.log(data);
    await refresh();
  }
}

await refresh();

export default {
  methods: {
    // return {
    async upsertItem() {
      await save();
    },
    async refresh() {
      await refresh();
    },
    async remove(id: string) {
      await remove(id);
    }
  },
  setup() {
    return {
      items,
      newItem
    };
  },
  name: 'Bestillinger',
  path: '/orderline'
}
</script>

<style>

input {
  display: inline-block;
  width: auto;
}

label span {
  display: inline-block;
  min-width: 8em;
}

</style>

<template>
  <form @submit.prevent="upsertItem">
    <fieldset>
      <legend>Registrer ny bestilling</legend>
      <label>
        <span>Navn:</span>
        <input type="text" v-model="newItem['name']">
      </label>
      <label>
        <span>Adresse:</span>
        <input type="text" v-model="newItem['address']">
      </label>
      <label>
        <span>Antall:</span>
        <input type="number" v-model="newItem['number_of_items']">
      </label>
      <label>
        <span>Kommentarer:</span>
        <input type="text" v-model="newItem['notes']">
      </label>
      <input type="submit" value="Registrer">
    </fieldset>
  </form>

  <p>
    <button @click="refresh">Oppdater</button>
  </p>
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
    <tr v-for="item of items">
      <td>{{ item.name }}</td>
      <td>{{ item.address }}</td>
      <td>{{ item.number_of_items }}</td>
      <td>{{item.owner_id}}</td>
      <td>{{ item.number_of_items * 75 }}</td>
      <th>
        <button @click="remove(item.id)">DELETE</button>
      </th>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <th colspan="2">
        Totalt:
      </th>
      <th>{{(items.value || []).map(s=>s.number_of_items).reduce((a,b) => a+b, 0)}}</th>
      <th></th>
      <th>213123</th>
    </tr>
    </tfoot>
  </table>

</template>
