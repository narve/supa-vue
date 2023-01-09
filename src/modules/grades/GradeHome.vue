<template>

  <h1>Grades</h1>

  <nav class="module">
    <ul>
      <router-link to="/grades/students">Students</router-link>
    </ul>
    <ul>
      <router-link to="/grades/questions">Questions</router-link>
    </ul>
    <ul>
      <router-link to="/grades/report">Report</router-link>
    </ul>
  </nav>

  <router-view></router-view>

</template>