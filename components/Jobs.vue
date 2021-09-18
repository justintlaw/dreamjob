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
    <!-- <template>
      <v-toolbar v-show="!isCreating" light rounded class="my-1">
        <v-text-field
          class="px-1"
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        ></v-text-field>
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-spacer></v-spacer>
          <v-select
            class="px-1"
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="keys"
            prepend-inner-icon="mdi-magnify"
            label="Sort by"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn-toggle
            class="mx-1"
            v-model="sortDesc"
            mandatory
          >
            <v-btn
              large
              depressed
              :value="false"
            >
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn
              large
              depressed
              :value="true"
            >
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>
        </template>
      </v-toolbar>
    </template> -->
    <div v-for="job in jobs" :key="job.id">
      <Job :job="job" @update-job="updateJob" @delete-job="removeJob" />
    </div>
  </v-data-iterator>
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
      console.log('jobsFetched', this.jobs)
      return this.jobs
    },
    isLoading: function () {
      return this.loading
    }//,
    // isCreating: function () {
    //   return this.creating
    // }
  },
  data () {
    return {
      // newJob: {
      //   title: '',
      //   location: '',
      //   description: '',
      //   salary: '',
      //   company: '',
      //   type: '',
      //   is_intern: false,
      //   post_date: null
      // },
      pagination: {
        rowsPerPage: 5,
        page: 1
      },
      itemsPerPage: 2,
      page: 1,
      loading: false,
      creating: true
    }
  },
  async mounted () {
    // temporary
    // find out why without set timeout the datatable is being shown before mounted is called
    // setTimeout(() => {
    //   this.loading = false
    // }, 1200)
    this.loading = false
    // this.loading = false
  },
  async created () {
    this.loading = true
    this.creating = true
  }
}
</script>
