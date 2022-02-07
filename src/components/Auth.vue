<script lang="ts">
export default {
	name: "User&Registration",
	path: "/auth"
};
</script>

<script setup lang="ts">
import { store } from "../supa/store";
import Login from "./Login.vue"
import Profile from "../components/Profile.vue"
</script>

<template>
	<div class="container">
		<Profile v-if="store.user" />
		<Login v-else />
	</div>
</template>

<style scoped>
.container {
	padding: 50px 0 100px 0;
}
</style>
