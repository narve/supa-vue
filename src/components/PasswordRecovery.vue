<script>

import {ref} from "vue";
import {fetchDataAsync, supabase} from "../supa";


const args = ref({});


const submitPassword = async () => {
  console.log('submitting...', JSON.stringify(args, '  '));
  const {error, data} = await supabase.auth.api
      .updateUser(args['access_token'], {password: args['password']});
  if (error) {
    console.warn(error);
    alert('Failed! ' + error.message);
  } else {
    alert('OK :) ');
  }
};

const extractArgs = () => {
  // access_token=x&refresh_token=y&expires_in=z&token_type=bearer&type=recovery
  // ['access_token', 'refresh_token', 'expires_in', 'token_type', 'type']
  //     .forEach(argName => args.value[argName] = document.location.hash[argName]);
  document.location.hash
      .split('&')
      .map(kvp => kvp.split('='))
      .forEach(([k, v]) => args.value[k] = v);
}


export default {
  methods: {
    submitPassword
  },
  setup() {
    extractArgs();
    console.log('process hash: ', document.location.hash);
    console.log('process hash: ', args.value);
    return {

      args
    };
  },
  // submitPassword,
  args,
};
</script>
<template>

  <pre>args: 
    {{ JSON.stringify(args) }}
  </pre>

  <h2>Password recovery</h2>

  <form @submit.prevent="submitPassword">

    <label>
      Velg et nytt passord her. Ikke samme passord som noen andre steder, helst :)
      <input type="text" placeholder="password" name="password" v-model="args['password']">
    </label>

    <input type="submit" value="Sett passord">

  </form>

</template>
