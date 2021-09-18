<template>
  <div>
    <v-row class="pa-10">
      <v-col cols="12" md="4" lg="6" xl="6">
        <div>
          <h2 class="text-h1 text-md-h3">Dreamjob App</h2>
          <p class="text-subtitle">Save information about your favorite jobs and build your career timeline!</p>
        </div>

        <!-- <img src="~/assets/job_searcher.png"> -->
      </v-col>

      <v-divider vertical></v-divider>

      <v-col cols="12" md="4" lg="6" xl="6">
        <h2 class="text-h1 text-md-h3">Usage:</h2>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Jobs</v-list-item-title>
            <v-list-item-subtitle>Save information about your favorite jobs</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>

        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title>Timeline</v-list-item-title>
            <v-list-item-subtitle>Organize your favorite jobs into your very own career timeline</v-list-item-subtitle>
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