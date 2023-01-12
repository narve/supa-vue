<script lang="ts" setup>
import { ref } from "vue"
import { supabase } from "../supa"

const loading = ref(false)
const email = ref("")
const password = ref("")

const handleMagicLogin = async () => {
	const emailRedirectTo = window.location.origin
  // console.log({emailRedirectTo})
  // return
	// const emailRedirectTo = "http://localhost:3000"
	try {
		loading.value = true
		const { error } = await supabase.auth.signInWithOtp({
			email: email.value,
			options: {
				emailRedirectTo
			}
		})
		if (error)
			alert(error.message)
		alert("Check your email for the login link!")
	} finally {
		loading.value = false
	}
}
const handlePasswordLogin = async () => {
	try {
		loading.value = true
		const { error } = await supabase.auth.signInWithPassword(
			{ email: email.value, password: password.value }
		);
		if (error)
			alert(error.message)
		else
			alert("Nå er du logget inn :) ")
	} finally {
		loading.value = false
	}
}

const handleFacebookLogin = async () => {
	try {
		loading.value = true
		const { data, error } = await supabase.auth.signInWithOAuth({
			provider: 'facebook',
		});
		const { provider } = data
		console.log('Response from sign-in: ', { provider });
		if (error)
			alert(error.message);
	} finally {
		loading.value = false
	}
}
</script>

<template>

	<form>
		<label>
			Logg inn vha Facebook ved å klikke her:
			<button style="border: none; background-color: inherit;" @click.prevent="handleFacebookLogin">
				<img alt="facebook" role="button" src="/src/assets/fb.png" style="max-width: 2em; display: inline-block;">
			</button>
		</label>

	</form>


	<form class="row flex flex-center" @submit.prevent="handlePasswordLogin">
		<div class="col-6 form-widget">
			<p class="description">
				Logg inn vha e-post og passord, hvis du har registrert deg tidligere.
				Ikke bruk passordet til din e-post!
			</p>
			<div>
				<input
					v-model="email"
					class="inputField"
					placeholder="E-post"
					type="email"
				/>
			</div>
			<div>
				<input
					v-model="password"
					class="inputField"
					placeholder="passord"
					type="password"
				/>
			</div>
			<div>
				<input
					:disabled="loading"
					:value="loading ? 'Loading' : 'Login'"
					class="button block"
					type="submit"
				/>
			</div>
		</div>
	</form>

	<form class="row flex flex-center" @submit.prevent="handleMagicLogin">
		<div class="col-6 form-widget">
			<p class="description">
				Logg inn / registrer deg ved å få tilsendt en magisk innloggingslenke:
			</p>
			<div>
				<input
					v-model="email"
					class="inputField"
					placeholder="e-post"
					type="email"
				/>
			</div>
			<div>
				<input
					:disabled="loading"
					:value="loading ? 'Loading' : 'Send innloggingslenke'"
					class="button block"
					type="submit"
				/>
			</div>
		</div>
	</form>

</template>
