<template>
  <div class="mx-2">
    <v-row class="py-10">
      <v-col cols="12" md="3" lg="3" xl="3">
        <v-sheet color="grey lighten-3" rounded>

        </v-sheet>
      </v-col>

      <v-col cols="12" md="6" lg="6" xl="6">
        <v-card color="grey lighten-3">
          <!-- <v-card-title class="primary"> -->
            <v-tabs background-color="primary" class="pa-0 ma-0" height="70" v-model="tab">
              <v-tabs-slider color="white"></v-tabs-slider>
              <v-tab v-for="timeline in timelines" :key="timeline.id">
                {{ timeline.name }}
              </v-tab>

              <!-- Show only if there are no timelines -->
              <v-tab v-if="timelines && timelines.length === 0">
                <span class="text-h5">Career Plan</span>
              </v-tab>
            </v-tabs>

            <!-- <v-tabs color="primary" class="pa-0 ma-0" height="70">
              <v-tab @click="addTimeline">
                New Plan
              </v-tab>
            </v-tabs> -->
            <!-- <v-layout class="d-inline-flex">
              <h4 class="text-h4 white--text font-weight-light">{{ timeline.name }}</h4>
              <v-menu :close-on-content-click="false" :nudge-width="100" offset-x>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" depressed color="primary">
                    <v-icon>mdi-menu</v-icon>
                  </v-btn>
                </template>

                <v-card>
                  <div class="d-flex flex-row-reverse pa-1 mb-0">
                      <v-btn v-show="!isEditingTimelineTitle" depressed x-small fab color="white" @click="isEditingTimelineTitle = !isEditingTimelineTitle">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>

                      <div v-show="isEditingTimelineTitle">
                      <v-btn depressed x-small fab color="white" @click="isEditingTimelineTitle = !isEditingTimelineTitle">
                        <v-icon>mdi-check</v-icon>
                      </v-btn>
                      <v-btn depressed x-small fab color="white" @click="isEditingTimelineTitle = !isEditingTimelineTitle">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                      </div>
                  </div>

                  <v-divider></v-divider>
                  <v-list class="pt-0 mt-0">
                    <v-list-item v-for="timeline in timelines" :key="timeline.id" link>
                      <v-text-field v-show="isEditingTimelineTitle" v-model="timeline.name"></v-text-field>
                      <v-list-item-title v-show="!isEditingTimelineTitle" v-text="timeline.name"></v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>

              <div style="max-width: 200px">
              <v-slide-group show-arrows>
                <v-slide-item v-for="timeline in timelines" :key="timeline.id">
                  <div>
                    <v-btn class="mx-2" depressed>{{ timeline.name }}</v-btn>
                  </div>
                </v-slide-item>
              </v-slide-group>
              </div>
            </v-layout> -->
          <!-- </v-card-title> -->
          <!-- <v-card-title class="primary">
            <h4 class="text-h4 white--text font-weight-light">{{ timeline.name }}</h4>
          </v-card-title>
          
          <v-card-text class="py-3">
            <Timeline :timeline="timeline" @shift-up="shift" @shift-down="shift" />
          </v-card-text> -->
          <TimelineLoader v-if="!timelines" />

          <v-tabs-items v-model="tab">
            <v-tab-item v-for="timeline in timelines" :key="timeline.id">
              <Timeline v-if="timelines" :timeline="timeline" :jobs="jobs"
                :loadingAddTimeline="loadingAddTimeline" :loadingDeleteTimeline="loadingDeleteTimeline"
                @shift-up="shift"
                @shift-down="shift"
                @create-timeline="createTimeline"
                @update-timeline="updateTimeline"
                @delete-timeline="deleteTimeline"
                @add-job-to-timeline="addJobToTimeline"
                @update-timeline-job-date="updateTimelineJobDate"
                @remove-job-from-timeline="removeJobFromTimeline"
                ref="timelineForm" />
            </v-tab-item>
          </v-tabs-items>

          <!-- Show only if there are no timelines -->
          <div v-show="timelines && timelines.length === 0">
            <div class="d-flex ma-2 py-2">
              <div>
                <p>Plan your career on a timeline.</p>
                <v-btn outlined class="my-2 mr-2" @click="createTimeline" :loading="loadingAddTimeline">New Plan</v-btn>
              </div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="3" lg="3" xl="3">
        <v-sheet color="grey lighten-3" rounded>
          
        </v-sheet>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { Auth } from 'aws-amplify'
import Timeline from '../../components/Timeline.vue'
import { API_BASE_URL } from '../../constants'

export default {
  components: {
    Timeline
  },
  data () {
    return {
      loading: true,
      timelines: null, // array
      jobs: [],
      isEditing: false,
      isEditingTimelineTitle: false,
      tab: null,
      loadingAddTimeline: false,
      loadingDeleteTimeline: false
    }
  },
  computed: {
    isLoading: function () {
      return this.loading
    }
  },
  methods: {
    test () {
      console.log(this.isEditingTimelineTitle)
      this.isEditingTimelineTitle = !this.isEditingTimelineTitle
    },
    shift (shiftedTimeline) {
      let timelineIndex = this.timelines.findIndex(timeline => timeline.id === shiftedTimeline.id)

      this.timelines[timelineIndex] = shiftedTimeline
    },
    async getAllTimelines() {
      const options = await this.fetchOptions()
      const res = await fetch(`${API_BASE_URL}/timeline`, options)

      if (res.status === 401) {
        return
      }

      const data = await res.json()

      for (let timeline of data.timelines) {
        for (let job of timeline.jobs) {
          job.startDate = job.startDate.split('T')[0]
          job.endDate = job.endDate.split('T')[0]
          console.log(JSON.stringify(job))
        }
      }

      return data.timelines
    },
    async getTimeline(id) {
      const options = await this.fetchOptions()
      const res = await fetch(`${API_BASE_URL}/timeline/${id}`, options)

      const data = await res.json()

      return data
    },
    async createTimeline() {
      this.loadingAddTimeline = true
      const options = await this.fetchOptions('POST')
      const res = await fetch(`${API_BASE_URL}/timeline`, options)

      const data = await res.json()

      this.timelines.push(data)
      this.loadingAddTimeline = false
    },
    async deleteTimeline(timelineId) {
      this.loadingDeleteTimeline = true

      let timelineIndex = this.timelines.findIndex(timeline => timeline.id === timelineId)

      const options = await this.fetchOptions('DELETE')
      await fetch(`${API_BASE_URL}/timeline/${timelineId}`, options)

      this.timelines.splice(timelineIndex, 1)
      this.loadingDeleteTimeline = false
    },
    async addJobToTimeline({ jobId, timelineId }) {
      let startDate, endDate
      console.log(timelineId)

      let timelineIndex = this.timelines.findIndex(timeline => timeline.id === timelineId)
      let timelineJobs = this.timelines[timelineIndex].jobs

      // set the default dates for a new job
      if (timelineJobs.length > 0) {
        startDate = new Date(timelineJobs[timelineJobs.length - 1].endDate)
        startDate.setDate(startDate.getDate() + 1)
      } else {
        startDate = new Date()
      }
      endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 365)

      const body = {
        jobId,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }

      const options = await this.fetchOptions('POST', body)
      const res = await fetch(`${API_BASE_URL}/timeline/${timelineId}/job`, options)
      const addedJob = await res.json()

      // we need to reformat dates from the response
      addedJob.startDate = addedJob.startDate.split('T')[0]
      addedJob.endDate = addedJob.endDate.split('T')[0]

      this.timelines[timelineIndex].jobs.push(addedJob)
    },
    async removeJobFromTimeline({ jobId, timelineId }) {
      let timelineIndex = this.timelines.findIndex(timeline => timeline.id === timelineId)
      let jobIndex = this.timelines[timelineIndex].jobs.findIndex(job => job.id === jobId)

      const options = await this.fetchOptions('DELETE')
      await fetch(`${API_BASE_URL}/timeline/${timelineId}/job/${jobId}`, options)
      this.timelines[timelineIndex].jobs.splice(jobIndex, 1)
    },
    async updateTimeline(timeline) {
      const options = await this.fetchOptions('POST', timeline)
      const res = await fetch(`${API_BASE_URL}/timeline/${timeline.id}`, options)

      if (res.status === 401) {
        return
      }

      const data = await res.json()

      for (let timeline of data.timelines) {
        for (let job of timeline.jobs) {
          job.startDate = job.startDate.split('T')[0]
          job.endDate = job.endDate.split('T')[0]
          console.log(JSON.stringify(job))
        }
      }
    },
    async updateTimelineName({ timelineId, newName }) {
      const options = await this.fetchOptions('POST', { newName })
      const res = await fetch(`${API_BASE_URL}/timeline/${timelineId}`, options)

      const data = await res.json()
    },
    async updateTimelineJobDate(timelineJob) {
      console.log('updating!!!', timelineJob)
      let timelineIndex = this.timelines.findIndex(timeline => timeline.id === timelineJob.timelineId)
      const options = await this.fetchOptions('POST', timelineJob)
      const res = await fetch(`${API_BASE_URL}/timeline/${timelineJob.timelineId}/job/${timelineJob.jobId}`, options)

      const data = await res.json()
      // this.$set(this.timelines, timelineIndex, data)

      console.log('response date', data)
    },
    async getAllJobs () {
      const options = await this.fetchOptions()
      const res = await fetch(`${API_BASE_URL}/jobs`, options)

      if (res.status === 401) {
        return
      }

      console.log(res)

      const data = await res.json()
      let jobs = data.jobs

      return jobs
    },
    // consider making this a plugin
    // it's being used in different components
    async fetchOptions(method = 'GET', body = null) {
      let idToken

      try {
        idToken = (await Auth.currentSession()).idToken.jwtToken
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
    this.timelines = await this.getAllTimelines()
    this.timeline = this.timelines[0]
    this.jobs = await this.getAllJobs()
  }
}
</script>