<script setup lang="ts">
import {standardEmits} from "../../utils/standardEmits";

const emit = defineEmits(standardEmits)

</script>
<template>

  <h1>Prøvehåndtering</h1>

  <nav class="module">
    <ul>
      <router-link to="/grades/questionnaires">Prøver</router-link>
    </ul>
    <ul>
      <router-link to="/grades/students">Elever</router-link>
    </ul>
  </nav>

  <router-view
      @startloading="(args) => emit('startloading', args)"
      @doneloading="() => emit('doneloading', args)"
      @error="(args) => emit('error', args)"
  ></router-view>

</template>