<style scoped>
.btn-disabled {
  pointer-events: none;
  color: #EBEBE4;
}

.swap-cards-move {
  transition: transform 0.5s;
}
</style>

<template>
  <div>
    <!-- <TimelineLoader v-show="true" /> -->

    <v-form @submit="onSubmit" ref="form" v-show="!isLoading">
    <!-- <v-card-title class="primary">
      <v-layout class="d-inline-flex">
        <h4 class="text-h4 white--text font-weight-light">{{ timeline.name }}</h4>
        <v-spacer></v-spacer>
        <v-btn v-show="!isEditing" @click="isEditing = true">Edit</v-btn>
        <div v-show="isEditing">
          <v-btn type="submit" class="mx-1" color="accent">Save Changes</v-btn>
          <v-btn class="ml-1" @click="isEditing = false">Cancel</v-btn>
        </div>
      </v-layout>
    </v-card-title> -->

    <v-card-text class="py-3">
    <div class="d-flex pa-2">
      <div v-show="!editingTitle">
        <h4 class="text-h4">{{ timeline.name }}</h4>
      </div>
      
      <div v-show="editingTitle">
        <div class="d-flex">
          <v-form @submit="submitNameChange">
            <v-text-field v-model="newTitle" label="Title"></v-text-field>
          </v-form>
          <v-btn icon @click="cancelEditTitle" class="mt-4">
            <v-icon depressed fab color="danger">mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
      <v-spacer></v-spacer>
      <!-- <v-btn v-show="!isEditing" @click="isEditing = true">Edit</v-btn> -->

      <v-menu offset-y> 
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon fab depressed>mdi-cog</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item link @click="editingTitle = true">
            <v-list-item-title>
              <span class="text-button pr-1">Rename</span>
              <v-icon>mdi-pencil</v-icon>
            </v-list-item-title>
          </v-list-item>

          <v-list-item link>
            <v-list-item-title>
              <span class="text-button pr-1">Delete</span>
              <v-icon color="danger">mdi-trash-can</v-icon>
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon fab depressed>mdi-menu</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item link @click="currentView = 'timeline'">
            <v-list-item-title>Timeline</v-list-item-title>
          </v-list-item>
          <v-list-item link @click="currentView = 'stats'">
            <v-list-item-title>Stats</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <div v-show="isEditing">
        <v-btn type="submit" class="mx-1" color="accent">Save</v-btn>
        <v-btn class="ml-1" @click="isEditing = false">Cancel</v-btn>
      </div>
      
    </div>
    
    <!-- <v-row class="pa-2">
      <v-col cols="4">
        <v-icon large color="blue">mdi-information-outline</v-icon>        
      </v-col>

      <v-col cols="4">
        <div class="d-flex justify-center">
          <h4 class="text-h4">Career Plan</h4>
        </div>
      </v-col>

      <v-col cols="4">
      <div class="d-flex flex-row-reverse">
      <v-btn v-show="!isEditing" @click="isEditing = true">Edit</v-btn>
      <div v-show="isEditing">
        <v-btn type="submit" class="mx-1" color="accent">Save</v-btn>
        <v-btn class="ml-1" @click="isEditing = false">Cancel</v-btn>
      </div>
      </div>
      </v-col>
    </v-row> -->
    <v-divider></v-divider>
    <div class="d-flex justify-end mt-2 mb-2 pb-0">
      <div>
        <v-btn outlined class="mr-2" @click="createTimeline" :loading="loadingAddTimeline">New Plan</v-btn>
        <v-btn color="danger" outlined @click="deleteTimeline" :loading="loadingDeleteTimeline">Delete</v-btn>
      </div>
    </div>
    <v-timeline v-show="showTimeline" class="mt-0 pt-2" dense>
      <transition-group name="swap-cards" tag="div">
      <v-timeline-item v-for="job in timeline.jobs" :key="job.id"
        class="py-0"
      >
        <TimelineJob
          :job="job"
          :upShiftDisabled="disableUpShift(job.id)"
          :downShiftDisabled="disableDownShift(job.id)"
          :isInvalidDate="isInvalidDate(job.id)"
          @shift-up="shiftUp"
          @shift-down="shiftDown"
          @update-start-date="updateStartDate"
          @update-end-date="updateEndDate"
          @update-timeline-job-date="updateTimelineJobDate"
          @remove-job-from-timeline="removeJobFromTimeline"
        />
      </v-timeline-item>

      <!-- generate key with uuid -->
      <v-timeline-item class="pa-0" key="test">
        <v-alert  color="grey lighten-3">
        <div class="d-flex justify-center py-5">
        <v-dialog v-model="showAddJob" width="500" transition="dialog-bottom-transition">
          <template v-slot:activator="{ on, attrs }">
            <v-btn depressed fab icon
              v-bind="attrs" v-on="on"
            >
              <v-icon size="72">mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>

          <v-card>
            <v-card-title class="text-h5 grey lighten-2">
              Add Job to Timeline
            </v-card-title>

            <v-card-text>
              <v-data-iterator :items="jobs" :search="search" class="pt-2"
                hide-default-footer
                :custom-filter="filterJobs"
              >
                <template v-slot:header>
                <v-toolbar>
                  <v-text-field v-model="search"
                    clearable
                    flat
                    solo
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    label="Search"
                  >
                  </v-text-field>
                </v-toolbar>
                </template>

                <v-hover v-slot="{ hover }" v-for="job in filteredJobs" :key="job.id" tile>
                  <v-card
                    class="pa-1" tile :elevation="hover ? 6 : 2"
                  >
                    <div :class="hover ? 'card-hover' : 'card-normal'">
                    <h6 class="text-h6">{{ job.title }}</h6>
                    <p>{{ job.location }} @ {{ job.company }}</p>
                    </div>
                    <v-fade-transition>
                      <v-overlay v-if="hover" absolute color="#034b63">
                        <v-btn @click="addJobToTimeline(job.id)">Add</v-btn>
                      </v-overlay>
                    </v-fade-transition>
                  </v-card>
                </v-hover>
              </v-data-iterator>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="accent" text @click="showAddJob = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        </div>
        </v-alert>
      </v-timeline-item>
      
      </transition-group>
    </v-timeline>

    <TimelineStats v-show="showStats" :timeline="timeline" />

    <!-- <v-snackbar
      v-model="showMessage"
    >
      {{ message }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="showMessage = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar> -->
    </v-card-text>
    </v-form>
  </div>
</template>

<style scoped>
.btn-disabled {
  pointer-events: none;
  color: #EBEBE4;
}

.swap-cards-move {
  transition: transform 0.5s;
}

.card-normal {
  color: rgba(0, 0, 0, 1);
}

.card-hover {
  color: rgba(0, 0, 0, 0.25);
}
</style>

<script>
import TimelineLoader from './TimelineLoader.vue'
import TimelineJob from './TimelineJob.vue'
import TimelineDatepicker from './TimelineDatepicker.vue'
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
//:dense="$vuetify.breakpoint.smAndDown"

/**
 * Do date picker logic here
 * anything that goes deeper than here should use
 * $emit with @change
 */

export default {
  name: 'Timeline',
  components: { TimelineJob, TimelineLoader },
  mixins: [validationMixin],
  validations: {
    timeline: {
      job: {
        startDate: {
          required
        }
      }
    },
    job: {
      startDate: {
        required
      },
      endDate: {
        required
      }
    }
  },
  props: {
    timeline: Object,
    jobs: Array,
    loadingAddTimeline: Boolean,
    loadingDeleteTimeline: Boolean
  },
  computed: {
    showTimeline: function() {
      return this.currentView === 'timeline'
    },
    showStats: function() {
      return this.currentView === 'stats'
    },
    isLoading: function() {
      return this.loading
    },
    startDateErrors() {
      const errors = []
      if (!this.$v.timeline.job.startDate.$dirty) return errors
      !this.$v.timeline.job.startDate.required && errors.push('Start date is required')
      return errors
    },
    endDateErrors() {
      const errors = []
      if (!this.$v.job.endDate.$dirty) return errors
      !this.$v.job.endDate.required && errors.push('End date is required')
      return errors
    },
    filteredJobs() {
      // do nothing if no jobs
      console.log('filtering jobs')
      if (!this.jobs || this.jobs.length === 0) return []

      const filteredJobs = this.filterJobs(this.jobs, this.search)
      return filteredJobs
    }
  },
  data () {
    return {
      months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'NOV', 'OCT', 'DEC'],
      showMessage: false,
      message: '',
      newTitle: '',
      isEditing: false,
      editingTitle: false,
      showAddJob: false,
      search: '',
      loading: false,
      currentView: 'timeline'
    }
  },
  methods: {
    cancelEditTitle() {
      this.newTitle = this.timeline.name
      this.editingTitle = false
    },
    createTimeline() {
      this.$emit('create-timeline')
    },
    deleteTimeline() {
      this.$emit('delete-timeline', this.timeline.id)
    },
    addJobToTimeline(jobId) {
      console.log('timelineid', this.timeline.id)
      this.$emit('add-job-to-timeline', { jobId: jobId, timelineId: this.timeline.id })
    },
    updateTimelineJobDate(timelineJob) {
      this.$emit('update-timeline-job-date', { ...timelineJob, timelineId: this.timeline.id })
    },
    removeJobFromTimeline(jobId) {
      this.$emit('remove-job-from-timeline', { jobId: jobId, timelineId: this.timeline.id })
    },
    filterJobs(items, search) {
      // do nothing if there are no jobs associated with the user
      if (!this.jobs) return []

      let filteredItems = items

      if (search) {
        search = search.toUpperCase()
        filteredItems = filteredItems
          .filter(item =>
            (item.title.toUpperCase().includes(search) ||
            item.location.toUpperCase().includes(search) ||
            item.company.toUpperCase().includes(search)))
      }
      console.log('done search')

      if (this.timeline?.jobs?.length > 0) {
        console.log('in timeline jobs')
        const currentJobIds = this.timeline.jobs.map(job => job.id)

        filteredItems = filteredItems.filter(item => !currentJobIds.includes(item.id))
      }

      return filteredItems
    },
    allowedEndDates: (val, job) => {
      console.log(val)
      console.log(job)
      return new Date(val).getTime() < new Date('2021-05-01').getTime()
    },
    getPrevStartDate(jobId) {
      let jobs = this.timeline.jobs
      let jobIndex = jobs.findIndex(job => job.id === jobId)

      if (jobIndex === 0) return null

      return jobs[jobIndex - 1].startDate
    },
    getNextStartDate(jobId) {
      let jobs = this.timeline.jobs
      let jobIndex = jobs.findIndex(job => job.id === jobId)

      if (jobIndex === jobs.length - 1 || jobs.length === 1) return null

      return jobs[jobIndex + 1]
    },
    formatDate(date) {
      return `${this.months[new Date(date).getMonth()]} ${new Date(date).getFullYear()}`
    },
    isInvalidDate(jobId) {
      // return false if the object doesn't exist yet
      if (!this.timeline?.jobs) return false
      // check if a date is valid
      let jobs = this.timeline.jobs
      let jobIndex = jobs.findIndex(job => job.id === jobId)
      
      // for now just check if the previous job's start date is dated after this one
      // for now we are not validating end dates
      if (jobIndex > 0 && jobs.length > 1) {
        // check if the date is less than any previous date
        for (let i = 1; i <= jobIndex; i++) {
          if (jobs[i - 1].startDate > jobs[jobIndex].startDate) {
            return true
          }
        }
      }
      // if (jobIndex > 0 && jobs.length > 1) {
      //   if (jobs[jobIndex - 1].startDate > jobs[jobIndex].startDate) {
      //     return true
      //   }
      // }

      return false
    },
    shiftUp (jobId) {
      console.log(jobId)
      let jobs = this.timeline.jobs
      console.log(jobs)

      let jobIndex = jobs.findIndex(job => job.id === jobId)
      console.log(jobIndex)

      // swap the jobs
      let jobToSwap = jobs[jobIndex - 1]
      // jobs[jobIndex - 1] = jobs[jobIndex]
      // jobs[jobIndex] = jobToSwap

      this.$set(this.timeline.jobs, jobIndex - 1, jobs[jobIndex])
      this.$set(this.timeline.jobs, jobIndex, jobToSwap)

      console.log(JSON.stringify(this.timeline.jobs))

      this.$emit('shift', this.timeline)
    },
    shiftDown(jobId) {
      let jobs = this.timeline.jobs

      let jobIndex = jobs.findIndex(job => job.id === jobId)

      let jobToSwap = jobs[jobIndex + 1]

      this.$set(this.timeline.jobs, jobIndex + 1, jobs[jobIndex])
      this.$set(this.timeline.jobs, jobIndex, jobToSwap)

      console.log('down shift', JSON.stringify(this.timeline.jobs))

      this.$emit('shift', this.timeline)
    },
    disableUpShift(jobId) {
      const jobIndex = this.timeline.jobs.findIndex(job => job.id === jobId)
      console.log('upshift disable', jobIndex === 0)
      return jobIndex === 0
    },
    disableDownShift(jobId) {
      const jobIndex = this.timeline.jobs.findIndex(job => job.id === jobId)

      return jobIndex === this.timeline.jobs.length - 1
    },
    updateStartDate(updatedJob) {
      console.log('updating start date')
      const jobIndex = this.timeline.jobs.findIndex(job => job.id === updatedJob.id)

      this.timeline.jobs[jobIndex].startDate = updatedJob.startDate

      console.log('updated start date to ', this.timeline.jobs[jobIndex].startDate)
    },
    updateEndDate(updatedJob) {
      const jobIndex = this.timeline.jobs.findIndex(job => job.id === updatedJob.id)

      this.timeline.jobs[jobIndex].endDate = updatedJob.endDate
    },
    submitNameChange(event) {
      event.preventDefault()

      // this is the only validation here for now
      if (this.newTitle && this.newTitle !== this.timeline.name) {
        this.$emit('update-timeline-name', { timelineId: this.timeline.id, newName: this.newTitle })
      }
    },
    onSubmit(event = null) {
      event.preventDefault()
      console.log('submitting')

      let invalidDateExists = false

      for (let job of this.timeline.jobs) {
        if (this.isInvalidDate(job.id)) {
          console.log('invalid date found')
          invalidDateExists = true
          break
        }
      }

      if (invalidDateExists) {
        this.message = 'Changes cannot be made. One or more invalid dates exist.'
        this.showMessage = true

        return
      }

      this.$emit('update-timeline', this.timeline)
    },
    async submitForm() {
      await this.$nextTick()
      // this.$refs.form.submit()
      this.onSubmit()
    },
    test() {
      console.log(JSON.stringify(this.timeline.jobs[0]))
    }
  },
  async mounted () {
    this.loading = false
    this.newTitle = this.timeline.name
  },
  async created() {
    this.loading = true
  }
}
</script>