<template>
  <v-footer
    :height="$vuetify.breakpoint.smAndDown ? 50 : 60"
    color="primary"
  >
    <v-card
      class="d-flex"
      color="primary"
      flat
      tile
    >
      <v-btn class="mx-2" icon color="white" href="https://www.linkedin.com/in/lawrence-justin/" target="_blank">
        <v-icon>mdi-linkedin</v-icon>
      </v-btn>

      <v-btn class="mx-2" icon color="white" href="https://github.com/justintlaw" target="_blank">
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>