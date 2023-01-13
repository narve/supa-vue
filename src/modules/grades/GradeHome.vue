<template>

  <h1>Grades</h1>

  <nav class="module">
    <ul>
      <router-link to="/grades/questionnaires">Prøver</router-link>
    </ul>
    <ul>
      <router-link to="/grades/students">Elever</router-link>
    </ul>
  </nav>

  <router-view></router-view>

</template>