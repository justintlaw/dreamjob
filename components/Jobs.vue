<!--
TODO:
  Add success and other toast messages
  Implement search bar functionality
  Have loading when filter is getting
-->

<template>
  <div class="pa-2 px-4">
    <div v-if="loadingTest">
      <TempLoader />
    </div>

    <div>
      <v-expand-transition>
        <AddJob v-show="isCreating" @cancel-add="$emit('cancel-add')" @add-job="addJob" />
      </v-expand-transition>
    </div>

    <v-data-iterator v-if="!loadingTest" :items="jobs" disable-pagination hide-default-footer>
      <div v-for="job in jobs.slice(currentIndex, currentIndex + itemsPerPage)" :key="job.id">
        <Job :job="job" @update-job="updateJob" @delete-job="removeJob" />
      </div>
    </v-data-iterator>
    <v-pagination
      v-if="jobs && jobs.length > 5 && !loadingTest"
      v-model="page"
      :length="numPages"
    ></v-pagination>   
  </div>
</template>

<script>
import Job from './Job.vue'
import AddJob from './AddJob.vue'

export default {
  name: 'Jobs',
  components: {
    Job,
    AddJob
  },
  props: {
    jobs: Array,
    isCreating: Boolean,
    loadingTest: Boolean
  },
  methods: {
    addJob(newJob) {
      this.$emit('add-job', newJob)
    },
    updateJob(newJob) {
      this.$emit('update-job', newJob)
    },
    removeJob(id) {
      console.log(id)
      this.$emit('delete-job', id)
    }
  },
  computed: {
    jobsFetched: function () {
      return this.jobs
    },
    isLoading: function () {
      return this.loading
    },
    numPages: function () {
      return Math.ceil(this.jobs.length / 5)
    },
    currentIndex: function () {
      // if (this.jobs.length <= 5) {
      //   return 1
      // }

      return (this.page - 1) * 5
    }
  },
  watch: {
    // watch changes in job and adjust page if necessary
    jobs: function () {
      // make sure the user is at least on page one
      if (this.jobs && this.jobs.length > 0 && this.jobs.length <= 5) {
        this.page = 1
      }

      const numPages = Math.ceil(this.jobs.length / 5)

      if (this.page > numPages) {
        this.page = numPages
      }
    }
  },
  data () {
    return {
      itemsPerPage: 5,
      page: 1,
      loading: false,
      creating: true
    }
  },
  async mounted () {
    this.loading = false
  },
  async created () {
    this.loading = true
    this.creating = true
  }
}
</script>
