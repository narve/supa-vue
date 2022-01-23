<script lang="ts">
import {getActiveConfig} from "../supa";

const cfg = getActiveConfig();


export default {
  name: "Supabase Config",
  path: "/supa",
  setup() {
    return {
      cfg
    }
  },
}
</script>

<template>
  <p>SupaConfig here pls</p>

  <div>
    Current supa-config:
    <pre>
{{ cfg }}
    </pre>
  </div>


</template>
