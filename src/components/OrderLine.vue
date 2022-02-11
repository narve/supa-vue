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

const num = (num?: number) => num?.toLocaleString("NO", {useGrouping: true});


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

</style>

<template>

  <!--  <h2>Bestillinger</h2>-->

  <div class="statistics" v-if="!!supabase.auth.user()?.id"
       :style="{visibility: orderline_statistics.number_of_items ? 'visible': 'hidden'}"
  >
    <div class="totals">
      <div class="total" v-for="total of orderline_statistics">
        <span class="label">{{total.label||'Totalt'}}: </span>
        <span class="number_of_items">{{num(orderline_statistics.number_of_items)}}</span>
        <span class="a">á 75kr =</span>
        <span class="total_amount">{{ num(orderline_statistics.total_amount) }}</span>
      </div>
    </div>

    <div>
      Dine:
      <span class="money">
      {{ num(sums.number_of_items) }} brett á 75 = {{ num(sums.amount_to_pay) }} kr!
    </span>
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
        <button v-if="item.id" role="button" @click="reset">Avbryt</button>
        <button v-if="item.id" role="button" @click="delete(item.id)">Fjern</button>
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
    <!--    <div>{{ item.notes }}</div>-->
    <div class="money">{{ item.number_of_items }} brett á 75kr = {{ item.number_of_items * 75 }}kr</div>
    <!--    <div>{{ item.number_of_items * 75 }}</div>-->
    <div>
      <button @click="edit(item.id)"><i class="material-icons">edit</i></button>
      <button @click="remove(item.id)"><i class="material-icons">delete</i></button>
    </div>
  </div>

  <!--  <div>-->
  <!--    <div >-->
  <!--      Dine bestillinger:-->
  <!--    </div>-->
  <!--    <div>{{ sums.number_of_items }}</div>-->
  <!--    &lt;!&ndash;      <th></th>&ndash;&gt;-->
  <!--    <th>{{ sums.amount_to_pay }}</th>-->
  <!--  </div>-->

</template>
