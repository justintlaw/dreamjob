<template>
  <div>
    <div v-for="skill in skills" :key="skill.id" class="d-inline-flex">
      <v-chip label class="ma-1">
        <v-icon left>mdi-label</v-icon>
        <span>{{ skill.name }}</span>
      </v-chip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobSkills',
  props: {
    skills: Array
  }
}
</script>