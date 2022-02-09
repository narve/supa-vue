<script lang="ts">
export default {
	name: 'Bestillinger',
	path: '/orderline'
}
</script>

<script setup lang="ts">
import { onBeforeMount, Ref, ref, UnwrapRef } from "vue";
import { supabase } from "../supa";

const items = ref([] as any[]);
const item: Ref<UnwrapRef<any>> = ref({});
const sums = ref({
	amount_to_pay: 0,
	number_of_items: 0
});

const save = async () => {
	const user = supabase.auth.user();
	console.log('create new', { user }, JSON.stringify(item.value, null, ' '));
	item.value.owner_id ||= user?.id;
	const { error, data } = await supabase.from("orderline").upsert(item.value);
	if (error) {
		console.error(error.message);
		alert('Error: ' + error.message);
	} else {
		console.log("Saved: ", { data });
		await refresh();
	}
};

const remove = async (args?: any) => {
	console.log('remove', args);
	const { error, data } = await supabase.from("orderline").delete().eq('id', args);
	if (error) console.error(error);
	else {
		console.log(data);
		await refresh();
	}
}

const refresh = async () => {
	const { error, data } = await supabase.from("orderline");
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


onBeforeMount(async () => {
	await refresh();
})
</script>

<style scoped>

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

</style>

<template>


	<form @submit.prevent="save">
		<fieldset>
			<legend>
				<i class="material-icons">add</i>
				<span v-if="item.id">Oppdater</span>
				<span v-if="!item.id">Registrer</span>
			</legend>
			<label>
				<span>Navn:</span>
				<input type="text" v-model="item['name']">
			</label>
			<label>
				<span>Adresse:</span>
				<input type="text" v-model="item['address']">
			</label>
			<label>
				<span>Antall:</span>
				<input type="number" v-model="item['number_of_items']">
			</label>
			<label>
				<span>Kommentarer:</span>
				<input type="text" v-model="item['notes']">
			</label>
			<span class="pull-right">
        <i class="material-icons">add</i>
        <input v-if="item.id" type="reset" value="Avbryt" @click="reset">
        <input type="submit" :value="item.id ? 'Oppdater' : 'Registrer'">
      </span>
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
			<td>{{ item.notes }}</td>
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
				Totalt:
			</th>
			<th>{{ sums.number_of_items }}</th>
			<th></th>
			<th>{{ sums.amount_to_pay }}</th>
		</tr>
		</tfoot>
	</table>

</template>
