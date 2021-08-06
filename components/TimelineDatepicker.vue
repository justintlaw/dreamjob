<template>
  <v-layout>
    <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
      <template v-slot:activator="{ on, attrs }">
        <v-text-field v-model="startDate" label="Start Date" append-outer-icon="mdi-calendar" v-bind="attrs" v-on="on"
          readonly
        ></v-text-field>
      </template>
      <v-date-picker v-model="startDate"></v-date-picker>
    </v-menu>
  </v-layout>
</template>

<script>
export default {
  name: 'TimelineDatepicker',
  props: {
    startDate: String,
    endDate: String
  }
}
</script>