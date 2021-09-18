<!--
TODO:
  - fix updating skills for a job (currently not working/buggy)
  - Change filter column into its own component
  - Hide filters by default on mobile
  - Slider doesn't update when text inputs are updated
  - adjust layout for md, especially decide about cols

  - Bigger change:
      Make as many actions as possible smooth
      opening thing, closing things, etc. should all have animations
      don't have items simply appear and disappear
-->

<template>
  <div>
    <div class="mx-5">
      <v-row class="py-10">
        <v-col cols="12" md="4" lg="3" xl="3">
          <v-sheet color="grey lighten-3" rounded>
            <v-container>
            <v-form @submit="onSubmit">
                <!-- <v-chip label class="mb-2" color="pink">Filters</v-chip> -->
                <v-layout>
                  <h5 class="pa-1 text-h5">Filters</h5>
                  <v-spacer></v-spacer>

                  <!-- TODO - implement transition -->
                  <!-- <v-expand-x-transition> -->
                    <div v-show="isFiltering">
                      <v-btn class="ma-1 pa-1" small color="accent" type="submit">Set</v-btn>
                      <v-btn class="ma-1 pa-1" small color="accent" @click="clearFilter">Clear</v-btn>
                    </div>
                  <!-- </v-expand-x-transition> -->
                  <v-btn class="ma-1 pa-1" small color="info" @click="filtering = !filtering" v-show="isFiltering">
                    Hide
                  </v-btn>
                  <v-btn class="ma-1 pa-1" small color="info" @click="filtering = !filtering" v-show="!isFiltering">
                    Show
                  </v-btn>
                </v-layout>
                
                <v-expand-transition>
                <div v-show="isFiltering" class="mt-2">
                <v-divider></v-divider>
                <v-container class="py-1 px-2">
                  <v-text-field v-model="filter.jobTitle" label="Job Title"></v-text-field>
                </v-container>
                <v-divider></v-divider>
                <v-container class="py-1 px-2">
                  <v-combobox v-model="filter.location" multiple chips deletable-chips label="Location"></v-combobox>
                </v-container>
                <v-divider></v-divider>
                <v-col cols="12">
                  <h6 class="text-h6">Salary</h6>
                  <v-range-slider
                    v-model="filter.salaryRange"
                    :min="min"
                    :max="max"
                    step="1000"
                    hide-details>
                  </v-range-slider>
                    <div class="d-flex justify-space-between">
                      <div style="width: 80px">
                        <v-text-field
                          :value="filter.salaryRange[0]"
                          single-line
                          type="number"
                          step="1000"
                          hide-details
                          dense
                          @change="$set(range, 0, $event)"
                        ></v-text-field>
                      </div>

                    <div style="width: 80px">
                      <v-text-field
                          :value="filter.salaryRange[1]"
                          single-line
                          type="number"
                          step="1000"
                          hide-details
                          dense
                          @change="$set(range, 1, $event)"
                      ></v-text-field>
                    </div>
                  </div>
                </v-col>
                <v-divider></v-divider>
                <v-col cols="12" class="d-flex justify-space-between">
                  <v-btn-toggle v-model="filter.jobType">
                    <v-btn elevation="2">
                      Full time
                    </v-btn>
                    <v-btn elevation="2">
                      Part time
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-divider></v-divider>
                <v-col cols="12" class="d-flex justify-space-between">
                  <v-btn-toggle v-model="filter.isIntern">
                    <v-btn medium elevation="2">
                      Job
                    </v-btn>
                    <v-btn medium elevation="2">
                      Intern
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
                <v-divider></v-divider>
                <v-container>
                  <v-combobox v-model="filter.skills" multiple chips deletable-chips label="Skills"></v-combobox>
                </v-container>
                </div>
                </v-expand-transition>
            </v-form>
            </v-container>
          </v-sheet>
        </v-col>
        <v-col cols="12" md="6" lg="6" xl="6">
          <div>
            <v-layout class="d-sm-flex">
              <h1 class="text-h5 text-md-h2 text-lg-h2 text xl-h2">Saved Jobs</h1>
              <v-spacer></v-spacer>
              <v-btn class="d-none d-md-flex mt-3 mb-3" elevation="4" color="primary" depressed right @click="creating=!creating" v-show="!creating">
                <div v-show="!creating">
                  <span class="pr-1">Add Job</span>
                  <v-icon>mdi-briefcase-plus-outline</v-icon>
                </div>
                <div v-show="creating">
                  <span class="pr-1">Add Job</span>
                  <v-icon>mdi-briefcase-minus-outline</v-icon>
                </div>
              </v-btn>

              <!-- Mobile version -->
              <v-btn class="d-flex d-md-none" color="pink" small fab absolute right @click="creating=!creating" v-show="!creating">
                <v-icon v-show="!creating" color="white">mdi-plus</v-icon>
                <v-icon v-show="creating" color="white">mdi-minus</v-icon>
              </v-btn>
            </v-layout>
          </div>

          <v-divider class="py-2"></v-divider>
          <v-sheet color="grey lighten-3" rounded :min-height="275">
            <Jobs
              :jobs="jobs"
              :isCreating="isCreating"
              :loadingTest="loading"
              @cancel-add="cancelAdd()"
              @add-job="createJob"
              @update-job="updateJob"
              @delete-job="deleteJob"
            />
          </v-sheet>
        </v-col>
        <v-col cols="12" md="2" lg="3" xl="3">
          <v-sheet rounded>
          </v-sheet>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@100&display=swap');

.h1 {
  font-family: 'Roboto';
}
</style>

<script>
import Jobs from '../../components/Jobs.vue'
import TempLoader from '../../components/TempLoader.vue'
import { Auth } from 'aws-amplify'
import { API_BASE_URL } from '../../constants'

export default {
  components: {
    Jobs,
    TempLoader
  },
  data () {
    return {
      jobs: [],
      loading: true,
      creating: false,
      filtering: true,
      min: 0,
      max: 300000,
      range: [0, 300000],
      filter: {
        jobTitle: '',
        location: [],
        salaryRange: [0, 300000],
        jobType: null,
        isIntern: null,
        skills: []
      },
      queryParams: ''
    }
  },
  computed: {
    isLoading: function () {
      return this.loading
    },
    test: function () {
      return 'I got computed!'
    },
    isCreating: function () {
      return this.creating
    },
    isFiltering: function () {
      console.log(this.filtering)
      return this.filtering
    }
  },
  methods: {
    async getUserInfoTest () {
      const info = await Auth.currentSession()
      console.log(info.idToken.jwtToken)
    },
    async onSubmit (event) {
      event.preventDefault()

      // add filtering
      // build the query string
      let query = ''

      // add job title
      if (this.filter.jobTitle) {
        query += `&jobTitle=${this.filter.jobTitle}`
      }

      // add locations
      const location = this.filter.location
      if (location.length > 0) {
        for (let index = 0; index < location.length; index++) {
          query += `&location[${index}]=${location[index]}`
        }
      }

      // add salary
      const salaryRange = this.filter.salaryRange
      if (!(salaryRange[0] === this.min && salaryRange[1] === this.max)) {
        query += `&salaryRange[0]=${salaryRange[0]}`
        query += `&salaryRange[1]=${salaryRange[1]}`
      }

      // full or part time
      if ([0, 1].includes(this.filter.jobType)) {
        const convertedType = this.filter.jobType === 0 ? 'full-time' : 'part-time'
        query += `&jobType=${convertedType}`
      }

      // job or internship
      if ([0, 1].includes(this.filter.isIntern)) {
        const convertedIsIntern = !!this.filter.isIntern
        query += `&is_intern=${convertedIsIntern}`
      }

      // add skills
      const skills = this.filter.skills
      if (skills.length > 0) {
        for (let index = 0; index < skills.length; index++) {
          query += `&skills[${index}]=${skills[index]}`
        }       
      }

      if (query) {
        query = query.replace('&', '?')
      }

      this.jobs = await this.getAllJobs(query)
      console.log('QUERY', query)
    },
    async clearFilter () {
      this.filter.jobTitle = ''
      this.filter.location = []
      this.filter.salaryRange = [0, 300000]
      this.filter.jobType = null
      this.filter.isIntern = null
      this.filter.skills = []      

      this.jobs = await this.getAllJobs()
    },
    async getAllJobs (queryParams = '?') {
      this.loading = true
      const options = await this.fetchOptions()
      const res = await fetch(`${API_BASE_URL}/jobs${queryParams}`, options)

      if (res.status === 401) {
        return
      }

      console.log(res)

      const data = await res.json()
      let jobs = data.jobs

      this.loading = false

      return jobs
    },
    async getJob (id) {
      const options = await this.fetchOptions()
      const res = await fetch(`${API_BASE_URL}/jobs/${id}`, options)
      const data = await res.json()
      let job = data.job

      return job
    },
    async createJob(newJob) {
      console.log('creating')
      const user = await Auth.currentAuthenticatedUser()
      console.log(user)
      newJob = {
        ...newJob,
        userId: user.attributes.sub
      }

      const options = await this.fetchOptions('POST', JSON.stringify(newJob))

      const res = await fetch(`${API_BASE_URL}/jobs`, options)

      const data = await res.json()
      this.jobs = [...this.jobs, data]
    },
    async updateJob (newJob) {
      const options = await this.fetchOptions('POST', JSON.stringify(newJob))

      const res = await fetch(`${API_BASE_URL}/jobs/${newJob.id}`, options)

      const data = await res.json()
      console.log('data', JSON.stringify(data))

      this.jobs = this.jobs
        .map(job => job.id === data.id ? data : job)
    },
    async deleteJob (id) {
      this.jobs = this.jobs
        .filter(job => job.id !== id)

      const options = await this.fetchOptions('DELETE')
      
      await fetch(`${API_BASE_URL}/jobs/${id}`, options)
    },
    async stopLoading() {
      console.log(this.loading)
      console.log('stop!')
      this.loading = false
    },
    cancelAdd() {
      this.creating = false
    },
    // TODO
    // Move this to a plugin since it will be used in most pages
    async fetchOptions(method = 'GET', body = null) {
      let idToken

      try {
        idToken = (await Auth.currentSession()).idToken.jwtToken
      } catch (err) {
        console.error(err)
        console.log('You are not signed in.')
        this.$router.push('/profile')
      }
      
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
          body: body
        }
      }

      return options
    }
  },
  async created () {
    this.loading = true
    
    this.filtering = this.$vuetify.breakpoint.smAndDown ? false : true
    this.jobs = await this.getAllJobs()
  }
}
</script>