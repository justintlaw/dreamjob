<template>
  <div>
    <div class="d-flex py-2 px-5">
      <v-icon large color="blue">mdi-information-outline</v-icon>
      <v-spacer></v-spacer>
      <h4 class="text-h4">Plan</h4>
      <v-spacer></v-spacer>
      <v-btn>Edit</v-btn>
    </div>
    <v-divider></v-divider>
    <v-timeline class="mt-2" dense>
      <v-timeline-item v-for="n in 2" :key="n" class="py-0">
        <!-- <v-alert color="grey lighten-3">
          <v-container class="mx-1">
            <div class="d-flex">
              <div class="d-flex">
                <p class="text-md-h6 my-0 pr-2"></p>
              </div>
            </div>
          </v-container>

          <v-card>
            <v-card-title class="d-flex">
              <span>title</span>
            </v-card-title>

            <v-card-text>
              <p>location/company</p>
            </v-card-text>
          </v-card>
        </v-alert> -->
        <v-skeleton-loader type="image" class="mx-4" height="300">

        </v-skeleton-loader>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>

<script>
export default {
  name: 'TimelineLoader'
}
</script>