<script setup lang="ts">
import {onBeforeMount, onBeforeUnmount, Ref, ref, UnwrapRef} from "vue";
import {supabase} from "../supa";

const orderline_statistics = ref([] as any);
const items = ref([] as any[]);
const item: Ref<UnwrapRef<any>> = ref({});
const sums = ref({
  amount_to_pay: 0,
  number_of_items: 0
});

const save = async () => {
  const user = supabase.auth.user();
  console.log('create new', {user}, JSON.stringify(item.value, null, ' '));
  item.value.owner_id ||= user?.id;
  const {error, data} = await supabase.from("orderline").upsert(item.value);
  if (error) {
    console.error(error.message);
    alert('Error: ' + error.message);
  } else {
    console.log("Saved: ", {data});
    item.value = {};
    await refresh();
  }
};

const remove = async (args?: any) => {
  console.log('remove', args);
  const {error, data} = await supabase.from("orderline").delete().eq('id', args);
  if (error) console.error(error);
  else {
    console.log(data);
    await refresh();
  }
}

const fetchStatistics = async () => {
  const {error, data} = await supabase.from("orderline_statistics");
  if (error) {
    console.log("Statistics failed: ", error.message);
  } else {
    console.log('got statistics: ', data);
    orderline_statistics.value = (data || [])[0];
  }
}

const refresh = async () => {
  const {error, data} = await supabase.from("orderline");
  if (error) console.error(error);
  else if (data) {
    console.log(data);
    items.value = data;
    sums.value.number_of_items = (items.value || []).map(s => s.number_of_items).reduce((a, b) => a + b, 0);
    sums.value.amount_to_pay = sums.value.number_of_items * 75;
  }
}

const edit = async (id: string) => {
  item.value = Object.assign({}, items.value.find(s => s.id === id));
}

const reset = async () => {
  item.value = {};
}


let statisticsIntervalRef: number;
onBeforeMount(async () => {
  await refresh();
  await fetchStatistics();
  statisticsIntervalRef = window.setInterval(fetchStatistics, 10000);
})
onBeforeUnmount(async () => {
  window.clearInterval(statisticsIntervalRef);
})
</script>

<style scoped>

button {
  margin-left: 2px;
}

form fieldset input {
  display: inline-block;
  width: auto;
}

label span {
  display: inline-block;
  min-width: 8em;
}

th {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pull-right {
  float: right;
}

table {
  width: 100%;
}

.items {
  outline: yellow 2px solid;
  display: grid;
  padding: 4px;
  row-gap: 10px;
  column-gap: 10px;

  /*grid-template-columns: 2fr 2fr 1fr 2fr 2fr;*/
  /*grid-template-columns: repeat(5, minmax(10px, 1fr));*/
  grid-template-columns: minmax(100px, 1fr) minmax(100px, 1fr) minmax(6em, 1fr) minmax(6em, 1fr) minmax(4em, 1fr) ;
}

/*.header {*/
/*  outline: red 2px solid;*/
/*  display: grid;*/
/*}*/

/*.header div {*/
/*  border: 1px #763f28 solid;*/
/*  padding: 2px;*/
/*}*/

/*.body {*/
/*  outline: red 2px solid;*/
/*  display: flex;*/
/*  flex-direction: column;*/
/*}*/

/*.body div {*/
/*  border: 1px #763f28 solid;*/
/*}*/

/*.item {*/
/*  display: flex;*/
/*}*/

</style>

<template>

  <!--  <h2>Bestillinger</h2>-->

  <div class="statistics" v-if="!!supabase.auth.user()?.id"
       :style="{visibility: orderline_statistics.number_of_items ? 'visible': 'hidden'}"
  >
    Totalt:
    {{ orderline_statistics.number_of_items?.toLocaleString("NO", {useGrouping: true}) }} bestillinger,
    {{ orderline_statistics.total_amount?.toLocaleString("NO", {useGrouping: true}) }} kr!
  </div>

  <form @submit.prevent="save">
    <fieldset>
      <legend>
        <!--        <i class="material-icons">add</i>-->
        <span v-if="item.id">Oppdater</span>
        <span v-if="!item.id">Registrer ny bestilling</span>
      </legend>
      <label>
        <span>Navn:</span>
        <input type="text" v-model.trim="item['name']">
      </label>
      <label>
        <span>Adresse:</span>
        <input type="text" v-model.trim="item['address']">
      </label>
      <label>
        <span>Antall:</span>
        <input type="number" v-model="item['number_of_items']">
      </label>
      <label>
        <span>Kommentarer:</span>
        <input type="text" v-model.trim="item['notes']">
      </label>
      <span class="pull-right">
        <button v-if="item.id" role="button" value="Avbryt" @click="reset">Avbryt</button>
        <button role="button">
<!--        <i class="material-icons">add</i>-->
          {{ item.id ? 'Oppdater' : 'Registrer' }}
        </button>
        <!--        <input type="submit" :value="item.id ? 'Oppdater' : 'Registrer'">-->
      </span>
    </fieldset>
  </form>


  <div class="items">
    <!--    <div class="header">-->
    <div>Navn</div>
    <div>Addresse</div>
    <div>Antall</div>
    <div>Å betale</div>
    <div>
      <i style="float:right" class="material-icons" @click="refresh">refresh</i>
    </div>
    <!--    </div>-->
    <!--    <div class="body">-->
    <template class="item" v-for="item of items">
      <div>{{ item.name }}</div>
      <div>{{ item.address }}</div>
      <div>{{ item.number_of_items }}</div>
      <!--      <div>{{ item.notes }}</div>-->
      <div>{{ item.number_of_items * 75 }}</div>
      <div>

        <button @click="edit(item.id)"><i class="material-icons">edit</i></button>
        <button @click="remove(item.id)"><i class="material-icons">delete</i></button>
      </div>
    </template>
    <!--    </div>-->
    <!--    <div class="footer">-->
    <div>totalt etc</div>
    <div>totalt etc</div>
    <div>totalt etc</div>
    <!--    </div>-->
  </div>

  <table v-if="false">
    <thead>
    <tr>
      <th>Navn</th>
      <th>Addresse</th>
      <th>Antall</th>
      <!--      <th>Notat</th>-->
      <th>Å betale</th>
      <th>
        <!--        Handlinger-->
        <!--                <button @click="refresh">Oppdater</button>-->
        <i style="float:right" class="material-icons" @click="refresh">refresh</i>
      </th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="item of items">
      <td>{{ item.name }}</td>
      <td>{{ item.address }}</td>
      <td>{{ item.number_of_items }}</td>
      <!--      <td>{{ item.notes }}</td>-->
      <td>{{ item.number_of_items * 75 }}</td>
      <th>

        <button @click="edit(item.id)"><i class="material-icons">edit</i></button>
        <button @click="remove(item.id)"><i class="material-icons">delete</i></button>
      </th>
    </tr>
    </tbody>
    <tfoot>
    <tr>
      <th colspan="2">
        Dine bestillinger:
      </th>
      <th>{{ sums.number_of_items }}</th>
      <!--      <th></th>-->
      <th>{{ sums.amount_to_pay }}</th>
    </tr>
    </tfoot>
  </table>

</template>
