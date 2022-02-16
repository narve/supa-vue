<script setup lang="ts">
import {onBeforeMount, onBeforeUnmount, Ref, ref, UnwrapRef} from "vue";
import {supabase} from "../supa";

/// Statistics 

const orderline_statistics = ref([] as any[]);
const sums = ref({
  amount_to_pay: 0,
  number_of_items: 0
});

const fetchStatistics = async (why?: string) => {
  const {error, data} = await supabase.from("orderline_statistics");
  if (error) {
    console.log("Statistics failed: ", error.message);
  } else {
    console.log('got statistics because ' + (why || 'reasons'), data);
    orderline_statistics.value = data as any[];
  }
}


/// Item list
const items = ref([] as any[]);

const refresh = async () => {
  const {error, data} = await supabase.from("orderline").select().order('id');
  if (error) console.error(error);
  else if (data) {
    console.log(data);
    items.value = data;
    sums.value.number_of_items = (items.value || []).map(s => s.number_of_items).reduce((a, b) => a + b, 0);
    sums.value.amount_to_pay = sums.value.number_of_items * 75;
  }
}


/// Active item

const currentItem = ref(null as any);

const startNewItem = () => {
  console.log('new item');
  currentItem.value = {};
}

const edit = (id: string) => {
  // startNewItem();
  currentItem.value = Object.assign({}, items.value.find(s => s.id === id));
  // currentItem.value = {};
  console.log('edit item: ', currentItem.value.id);
}

const reset = async () => {
  currentItem.value = null;
}

const save = async () => {
  const user = supabase.auth.user();
  console.log('Save: ', {user}, JSON.stringify(currentItem.value, null, ' '));
  // item.value.owner_id ||= user?.id; handled by database :) 
  const {error, data} = await supabase.from("orderline").upsert(currentItem.value);
  if (error) {
    console.error(error.message);
    alert('Error: ' + error.message);
  } else {
    console.log("Saved: ", {data});
    currentItem.value = null;
    await refresh();
  }
};

const remove = async (args?: any) => {
  console.log('remove', args);
  const {error, data} = await supabase.from("orderline").delete().eq('id', args);
  if (error) console.error(error);
  else {
    console.log(data);
    currentItem.value = null;
    await refresh();
    await fetchStatistics();
  }
}


/// **** Active row


const activeRow = ref(null as any);

const setActiveRow = (theItem: any) => {
  console.log('active row: ', theItem);
  currentItem.value = null;
  activeRow.value = theItem;
}


const formatNumber = (num?: number) => num?.toLocaleString("NO", {useGrouping: true});


let statisticsIntervalRef: number;
onBeforeMount(async () => {
  await refresh();
  // await fetchStatistics('initial');
  supabase
      .from('orderline')
      // .on('UPDATE', () => fetchStatistics('update'))
      // .on('INSERT', () => console.log('insert'))
      // .on('DELETE', () => console.log('delete'))
      .on('*', () => fetchStatistics('something happened'))
      .subscribe(() => fetchStatistics('subscribe'));

  // Note that we want an interval in addition to subscription... since 
  // RLS hides other peoples updates from us. 
  // statisticsIntervalRef = window.setInterval(() => fetchStatistics('timer'), 10000);
});


onBeforeUnmount(async () => {
  window.clearInterval(statisticsIntervalRef);
})

</script>

<style scoped>


body {
  padding: 0;
}

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

div.item.active {
  outline: #24b47e 3px solid;
}

div.item, div.item div {
  text-overflow: ellipsis;
  overflow: hidden;
}

div.item div, div.item button {
  display: inline-block;
  /*border-right: white 1px dashed;*/
  /*margin-right: 1em;*/
  /*padding-right: 1em;*/
  /*outline: red 2px solid;*/
}

div.item :last-child {
  /*display: none;*/
  float: right;
}

.item button i {
  font-size: smaller;
}


div.item {
  /*width: 100vw;*/
  border: antiquewhite solid 1px;
  margin-bottom: 16px;
  margin-right: 2px;
  margin-left: 2px;
  border-radius: 8px;
  padding: 2px;
  box-shadow: 2px 2px 2px brown;
}

div.item:hover {
  cursor: pointer;
}

div.money.money.money {
  white-space: nowrap;
  display: inline-block;
}


/*********** Items header *********/

.items-header {
  /*display: flex;*/
  width: 100vw;
  margin: auto auto 0.5em;
}

.items-header h3 {
  font-size: large;
}

.items-header p {
  font-size: small;
  font-weight: lighter;
}

/***********Totals *********/


.totals {
  display: grid;
  max-width: 30em;
  grid-template-columns: minmax(2em, 5em) minmax(2em, 3em) minmax(2em, 3em) minmax(2em, 5em)  minmax(2em, 5em) minmax(2em, 5em);
}

.totals span {
  padding-right: 1em;
}

.totals span {
  text-align: right;
}

</style>

<template>

  <!--  <h2>Bestillinger</h2>-->

  <div class="statistics" v-if="!!supabase.auth.user()?.id"
       :style="{visibility: orderline_statistics.length > 0 ? 'visible': 'hidden'}"
  >
    <div class="totals">
      <template class="total" v-for="total of orderline_statistics">
        <span class="label">{{ total.label }}: </span>
        <span class="number_of_items">{{ formatNumber(total.number_of_items) }}</span>
        <span class="unit">{{ total.unit || 'brett' }}</span>
        <span class="a">á 75kr</span>
        <span class="eq">=</span>
        <span class="total_amount">{{ formatNumber(total.total_amount) }}kr</span>
      </template>
    </div>

  </div>

<!--  <p>Current item? {{ currentItem !== null }}</p>-->

  <form>
    <button v-if="currentItem === null" @click="startNewItem()">Registrer bestilling</button>
  </form>

  <form @submit.prevent="save" v-if="currentItem !== null">
    <fieldset>
      <legend>
        <!--        <i class="material-icons">add</i>-->
        <span v-if="currentItem.id">Oppdater</span>
        <span v-if="!currentItem.id">Registrer ny bestilling</span>
      </legend>
      <label>
        <span>Navn:</span>
        <input type="text" v-model.trim="currentItem['name']" required>
      </label>
      <label>
        <span>Adresse:</span>
        <input type="text" v-model.trim="currentItem['address']">
      </label>
      <label>
        <span>Antall:</span>
        <input type="number" v-model="currentItem['number_of_items']" required>
      </label>
      <label>
        <span>Kommentarer:</span>
        <input type="text" v-model.trim="currentItem['notes']">
      </label>
      <span class="pull-right">
        <button role="button" @click="reset">Avbryt</button>
        <button v-if="currentItem.id" role="button" @click="remove(currentItem.id)">Fjern</button>
        <button role="button">
          {{ currentItem.id ? 'Oppdater' : 'Registrer' }}
        </button>
      </span>
    </fieldset>
  </form>

  <div class="item-list" v-if="currentItem === null">

    <div class="items-header">
      <div>
        <h3>Dine bestillinger</h3>
      </div>
      <p>Velg en bestilling for å se/redigere</p>
    </div>

    <div :class="{item:true, active:item.id === activeRow?.id}" v-for="item of items" @click="setActiveRow(item)" :key="item.id">
      <div>{{ item.name }}</div>
      <div>{{ item.address }}</div>
      <div class="money">{{ item.number_of_items }} brett á 75kr = {{ item.number_of_items * 75 }}kr</div>
      <!--      <p>active: {{ item.id === activeRow?.id }}</p>-->
      <div class="actions" v-if="item.id === activeRow?.id">
        <button @click.stop="edit(item.id)"><i class="material-icons">edit</i></button>
      </div>
    </div>
  </div>

</template>
