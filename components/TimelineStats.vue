<template>
  <v-container>
    <v-layout class="pb-2">
      <h2 class="text-h4">Career Stats</h2>
    </v-layout>

    <v-layout :class="showJobs ? 'd-flex align-center pb-0' : 'd-flex align-center pb-2'">
      <div class="d-flex">
        <p class="text-body-1 pr-2 mb-0">Jobs Held: {{ numJobs }}</p>
        <v-btn outlined x-small @click="showJobs = !showJobs">{{ showJobs ? 'Hide' : 'Show' }}</v-btn>
      </div>
    </v-layout>

    <v-expand-transition>
      <div v-show="showJobs">
        <div class="d-infline-flex align-center py-2">
          <v-chip v-for="job in timeline.jobs" :key="job.id" class="ma-2">
            {{ job.title }}
          </v-chip>
        </div>
      </div>
    </v-expand-transition>

    <v-layout :class="showLocations ? 'd-flex align-center pb-0' : 'd-flex align-center pb-2'">
        <p class="text-body-1 pr-2 mb-0">Places Lived: {{ numLocations }}</p>
        <v-btn outlined x-small @click="showLocations = !showLocations">{{ showLocations ? 'Hide' : 'Show' }}</v-btn>
    </v-layout>

    <v-expand-transition>
      <div v-show="showLocations">
        <div class="d-infline-flex align-center py-2">
          <v-chip v-for="location in locations" :key="location" class="ma-2">
            {{ location }}
          </v-chip>
        </div>
      </div>
    </v-expand-transition>

    <v-layout :class="showSkills ? 'd-flex align-center pb-0' : 'd-flex align-center pb-2'">
        <p class="text-body-1 pr-2 mb-0">Skills Learned: {{ numSkills }}</p>
        <v-btn outlined x-small @click="showSkills = !showSkills">{{ showSkills ? 'Hide' : 'Show' }}</v-btn>
    </v-layout>

    <v-expand-transition>
      <div v-show="showSkills">
        <div class="d-infline-flex align-center py-2">
          <v-chip v-for="skill in skills" :key="skill.name" class="ma-2">
            {{ skill.name }}
          </v-chip>
        </div>
      </div>
    </v-expand-transition>
  </v-container>
</template>

<script>
import { Auth } from 'aws-amplify'
import { API_BASE_URL } from '../constants'

export default {
  name: 'TimelineStats',
  props: {
    timeline: Object
  },
  data () {
    return {
      stats: null,
      locations: [],
      skills: [],
      showJobs: false,
      showLocations: false,
      showSkills: false
    }
  },
  computed: {
    numJobs: function () { return this.timeline?.jobs?.length || 0 },
    numLocations: function () { return this.locations?.length || 0 },
    numSkills: function () { return this.skills?.length || 0 }
  },
  methods: {
    async getTimelineStats() {
      const options = await this.fetchOptions('POST', {
        locations: 'distinctCount',
        skills: 'distinctCount'
      })

      let res
      try {
        res = await fetch(`${API_BASE_URL}/timeline/${this.timeline.id}/stats`, options)
      } catch(err) {
        console.error(err)
      }
      
      const data = await res.json()

      return data
    },
    async fetchOptions(method = 'GET', body = null) {
      let idToken

      try {
        idToken = (await Auth.currentSession()).idToken.jwtToken
        console.log(idToken)
      } catch (err) {
        console.error(err)
        console.log('You are not signed in.')
        this.$router.push('/profile')
      }
      console.log('TOKEN', idToken)
      let options = {
        method: method,
        headers: {
          'Content-type': 'application/json',
          'Authorization': idToken
        }
      }

      if (body) {
        options = {
          ...options,
          body: JSON.stringify(body)
        }
      }

      return options
    }
  },
  async mounted() {

  },
  async created() {
    // this.numJobs = 0
    this.locations = 0
    this.skills = 0
    this.stats = await this.getTimelineStats()
    this.locations = this.stats.locations
    this.skills = this.stats.skills
  }
}
</script>