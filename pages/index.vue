<template>
  <div>
    <v-row class="pa-10">
      <v-col cols="12" md="6" lg="6" xl="6">
        <div class="pb-5">
          <h2 class="text-h2 text-md-h3 pb-2">Dreamjob</h2>
          <p class="text-subtitle">Save information about your favorite jobs and build your career timeline!</p>
        </div>
      </v-col>

      <v-divider v-if="!$vuetify.breakpoint.smAndDown" vertical></v-divider>
      <v-divider v-if="$vuetify.breakpoint.smAndDown"></v-divider>

      <v-col cols="12" md="6" lg="6" xl="6">
        <h2 class="text-h2 text-md-h3">Usage:</h2>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Jobs</v-list-item-title>
            <v-list-item-subtitle>Save information about your favorite jobs</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Timeline</v-list-item-title>
            <v-list-item-subtitle>Organize favorite jobs into your own career timeline</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Profile</v-list-item-title>
            <v-list-item-subtitle>Save your top skills to your profile</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data () {
    return {
      reveal: false
    }
  }
}
</script>

<style scoped>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>