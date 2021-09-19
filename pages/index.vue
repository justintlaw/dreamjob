<template>
  <div class="ma-2">
    <v-row :class="$vuetify.breakpoint.smAndDown ? 'px-10 pt-2' : 'pa-10'">
      <v-col cols="12">
        <div class="">
          <!-- <h2 class="text-h2 text-md-h1 pb-2">Dreamjob</h2> -->
          <h2 :class="['text-h2 text-md-h2 text-center pb-6']">
            Dreamjob <v-icon color="primary" :size="$vuetify.breakpoint.smAndDown ? 60 : 80">mdi-database-search-outline</v-icon>
          </h2>
          <!-- <p class="text-center text-subtitle pl-2">Save information about your favorite jobs and build your career timeline!</p> -->

          <div class="d-flex justify-center">
            <v-alert
              max-width="600"
              elevation="4"
              dense
              text
            >
                <!-- <v-icon top>mdi-information-outline</v-icon> -->
                <p>
                  Save information about your favorite jobs and build your career timeline!
                </p>
            </v-alert>
          </div>
        </div>
      </v-col>
    </v-row>

    <v-row class="mb-16">
      <v-col cols="12" md="4" lg="4" xl="4">
        <NavigationCard :cardInfo="cardData.jobsCard" class="mb-5" />
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4">
        <NavigationCard :cardInfo="cardData.timelineCard" class="mb-5" />
      </v-col>
      <v-col cols="12" md="4" lg="4" xl="4">
        <NavigationCard :cardInfo="cardData.profileCard" />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import NavigationCard from '../components/NavigationCard.vue'

export default {
  components: {
    NavigationCard
  },
  data () {
    return {
      reveal: false,
      jobSeekerImage: require('../assets/job_searcher.png'),
      cardData: {
        jobsCard: {
          title: 'Jobs Database',
          // imageSource: 'https://icon-library.com/images/job-seeker-icon/job-seeker-icon-3.jpg',
          icon: 'mdi-clipboard-text-search-outline',
          innerTitle: 'Add More Jobs',
          innerText: 'Expand your list of jobs with an easy to use interface',
          buttonText: 'Go to jobs',
          buttonRoute: '/jobs'
        },
        timelineCard: {
          title: 'Career Timeline',
          icon: 'mdi-timeline-text-outline',
          innerTitle: 'Map Your Career',
          innerText: 'Plan your career by creating timelines and adding jobs to them',
          buttonText: 'Go to MyPlan',
          buttonRoute: '/timeline'
        },
        profileCard: {
          title: 'Profile',
          icon: 'mdi-card-account-details-outline',
          innerTitle: 'List Your Skills',
          innerText: 'Enhance your profile by adding your top skills',
          buttonText: 'Go to profile',
          buttonRoute: '/profile'
        }
      }
    }
  }
}
</script>

<style scoped>
.home-img {
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 25%
}

.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}
</style>