<script setup lang="ts">
import {onBeforeMount, onBeforeUnmount, Ref, ref, UnwrapRef} from "vue";
import {supabase} from "../supa";

const orderline_statistics = ref([] as any[]);
const items = ref([] as any[]);
const item: Ref<UnwrapRef<any>> = ref({});
const sums = ref({
  amount_to_pay: 0,
  number_of_items: 0
});

const save = async () => {
  const user = supabase.auth.user();
  console.log('create new', {user}, JSON.stringify(item.value, null, ' '));
  // item.value.owner_id ||= user?.id; handled by database :) 
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
    await fetchStatistics();
  }
}

const fetchStatistics = async (why?: string) => {
  const {error, data} = await supabase.from("orderline_statistics");
  if (error) {
    console.log("Statistics failed: ", error.message);
  } else {
    console.log('got statistics because ' + (why || 'reasons'), data);
    orderline_statistics.value = data as any[];
  }
}

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

const edit = async (id: string) => {
  item.value = Object.assign({}, items.value.find(s => s.id === id));
}

const reset = async () => {
  item.value = {};
}

const num = (num?: number) => num?.toLocaleString("NO", {useGrouping: true});


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
  statisticsIntervalRef = window.setInterval(() => fetchStatistics('timer'), 10000);
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


div.item, div.item div {
  text-overflow: ellipsis;
  overflow: hidden;
}

div.item div {
  display: inline-block;
  /*border-right: white 1px dashed;*/
  margin-right: 1em;
  padding-right: 1em;
  /*outline: red 2px solid;*/
}

div.item div:last-child {
  display: none;
  /*float: right;*/
}

.item button i {
  font-size: smaller;
}


body {
  padding: 0;
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
  display: block;
}

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
        <span class="number_of_items">{{ num(total.number_of_items) }}</span>
        <span class="unit">{{ total.unit || 'brett' }}</span>
        <span class="a">á 75kr</span>
        <span class="eq">=</span>
        <span class="total_amount">{{ num(total.total_amount) }}kr</span>
      </template>
    </div>

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
        <input type="text" v-model.trim="item['name']" required>
      </label>
      <label>
        <span>Adresse:</span>
        <input type="text" v-model.trim="item['address']">
      </label>
      <label>
        <span>Antall:</span>
        <input type="number" v-model="item['number_of_items']" required>
      </label>
      <label>
        <span>Kommentarer:</span>
        <input type="text" v-model.trim="item['notes']">
      </label>
      <span class="pull-right">
        <button v-if="item.id" role="button" @click="reset">Avbryt</button>
        <button v-if="item.id" role="button" @click="remove(item.id)">Fjern</button>
        <button role="button">
          {{ item.id ? 'Oppdater' : 'Registrer' }}
        </button>
      </span>
    </fieldset>
  </form>

  <div class="items-header">
    <div>
      <h3>Dine bestillinger</h3>
    </div>
    <p>Velg en bestilling for å se/redigere</p>
  </div>

  <div class="item" v-for="item of items" @click="edit(item.id)">
    <div>{{ item.name }}</div>
    <div>{{ item.address }}</div>
    <div class="money">{{ item.number_of_items }} brett á 75kr = {{ item.number_of_items * 75 }}kr</div>
  </div>

</template>
