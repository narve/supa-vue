<script  >
export default {
	name: 'Supabase Config',
	path: '/supa'
}
</script>

<script setup lang="ts">
import { activeSupabaseConfig } from "../supa";
</script>

<template>
	<p>SupaConfig here pls</p>

	<div>
		Current supa-config:
		<pre>
{{ activeSupabaseConfig }}
    </pre>
	</div>


</template>
