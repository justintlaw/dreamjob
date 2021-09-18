<template>
  <v-alert  color="grey lighten-3">
    <v-container :class="{ 'mx-1': !$vuetify.breakpoint.smAndDown, 'mt-0 pt-0': $vuetify.breakpoint.smAndDown }">
      <v-form @submit="onSubmit" ref="form">
      <!-- fix alignment if time, don't put all in a span -->
      <div :class="{ 'd-flex': !$vuetify.breakpoint.smAndDown, 'flex-row align-center': $vuetify.breakpoint.smAndDown }">
        <div v-if="$vuetify.breakpoint.smAndDown" class="d-flex pb-1 justify-space-between">
          <div>
            <v-btn depressed icon>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    v-bind="attrs"
                    v-on="on"
                  >mdi-information-variant</v-icon>
                </template>
                <span>Click on a card to learn more about a job</span>
              </v-tooltip>
            </v-btn>
          </div>

          <v-spacer></v-spacer>

          <div>
          <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-show="isInvalidDate" color="warning" class="pr-2"
                v-bind="attrs"
                v-on="on"
              >mdi-alert-outline</v-icon>
            </template>
            <span>Dates must be in chronological order before saving</span>
          </v-tooltip>

          <v-btn class="mx-0" depressed icon v-show="isEditing" type="submit">
            <v-icon color="success">mdi-check</v-icon>
          </v-btn>

          <v-btn @click="toggleEdit()" class="mx-0" depressed icon :disabled="loadingDelete">
            <v-icon v-show="!isEditing" color="secondary" class="pulse-button">mdi-briefcase-edit-outline</v-icon>
            <v-icon v-show="isEditing" color="secondary">mdi-close</v-icon>
          </v-btn>


          <v-btn v-show="!isEditing" class="mx-0" depressed icon @click="removeJobFromTimeline" :loading="loadingDelete">
            <v-icon color="danger">mdi-trash-can-outline</v-icon>
          </v-btn>
          </div>
        </div>
        <div class="d-flex">
          <p v-if="!($vuetify.breakpoint.smAndDown && isEditing)" class="text-body-1 text-md-h6 my-0 pr-2">{{ formatDate(startDate) }} - {{ formatDate(endDate) }}</p>
          
          <v-tooltip v-if="!$vuetify.breakpoint.smAndDown" top>
            <template v-slot:activator="{ on, attrs }">
              <v-icon v-show="isInvalidDate" color="warning"
                v-bind="attrs"
                v-on="on"
              >mdi-alert-outline</v-icon>
            </template>
            <span>Dates must be in chronological order before saving</span>
          </v-tooltip>
        </div>
        <v-spacer v-if="!$vuetify.breakpoint.smAndDown"></v-spacer>
        <!-- <v-spacer></v-spacer> -->
        <!-- <div :class="{ 'd-flex justify-end': $vuetify.breakpoint.smAndDown }"> -->
        <div v-if="!$vuetify.breakpoint.smAndDown">
          <v-btn class="mx-0" depressed icon v-show="isEditing" type="submit">
            <v-icon color="success">mdi-check</v-icon>
          </v-btn>

          <v-btn @click="toggleEdit()" class="mx-0" depressed icon :disabled="loadingDelete">
            <v-icon v-show="!isEditing" color="secondary" class="pulse-button">mdi-briefcase-edit-outline</v-icon>
            <v-icon v-show="isEditing" color="secondary">mdi-close</v-icon>
          </v-btn>


          <v-btn v-show="!isEditing" class="mx-0" depressed icon @click="removeJobFromTimeline" :loading="loadingDelete">
            <v-icon color="danger">mdi-trash-can-outline</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-show="isEditing">
        <v-layout>

          <!-- Datepicker view for desktop -->
          <v-menu :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="startDate" label="Start Date" append-outer-icon="mdi-calendar" v-bind="attrs" v-on="on"
                readonly
                :rules="startDateRules"
              ></v-text-field>
            </template>
            <v-date-picker v-model="startDate" :nudge-left="30" @change="updateStartDate(job)"></v-date-picker>
          </v-menu>

          <v-menu :close-on-content-click="false" transition="scale-transition" offset-y min-width="auto">
            <template v-slot:activator="{ on, attrs }">
              <v-text-field v-model="endDate" label="End Date" append-outer-icon="mdi-calendar" v-bind="attrs" v-on="on"
                readonly
                :rules="endDateRules"
              ></v-text-field>
            </template>
            <v-date-picker v-model="endDate" @change="updateEndDate(job)"></v-date-picker>
          </v-menu>

          <!-- Datepicker view for mobile (leave it to the device) -->
          <div v-if="$vuetify.breakpoint.smAndDown" class="d-inline-flex">
            <div class="d-flex">
              <v-text-field v-model="startDate" label="Start Date" append-outer-icon="mdi-calendar" v-bind="attrs" v-on="on"
                readonly
                :rules="startDateRules"
              ></v-text-field>
              <label for="startDate">Start Date</label>
              <input type="date" v-model="startDate" />
            </div>

            <div class="d-flex">
              <v-text-field v-model="endDate" label="End Date" append-outer-icon="mdi-calendar" v-bind="attrs" v-on="on"
                readonly
                :rules="endDateRules"
              ></v-text-field>
              <label for="d-flex">End Date</label>
              <input type="date" v-model="endDate" />
            </div>
          </div>
        </v-layout>
      </div>
      </v-form>
    </v-container>

    <v-card>
      <div class="pt-4 px-4 d-flex justify-space-between align-center">
        <span class="text-h6 text-md-h5">{{ job.title }}</span>

        <div :class="[$vuetify.breakpoint.smAndDown ? 'ml-auto d-flex flex-column pl-1 pr-0 mr-0' : 'ml-auto']">
          <v-btn small depressed fab color="white"
            @click="loadingDelete || shiftUp(job.id)"
            :class="{'btn-disabled': upShiftDisabled}"
          >
            <v-icon>mdi-chevron-up</v-icon>
          </v-btn>

          <v-btn small depressed fab color="white"
            @click="loadingDelete || shiftDown(job.id)"
            :class="{'btn-disabled': downShiftDisabled}"
          >
            <v-icon>mdi-chevron-down</v-icon>
          </v-btn>
        </div>
      </div>
      <v-card-text class="white pt-3">{{ job.location }} @ {{ job.company }}</v-card-text>
    </v-card>

    <v-snackbar
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
    </v-snackbar>
  </v-alert>  
</template>

<style scoped>
.btn-disabled {
  pointer-events: none;
  color: #EBEBE4;
}

.swap-cards-move {
  transition: transform 0.5s;
}
</style>

<script>
/**
 * Not using vuelidate in for the date forms as
 * the default vuetify rules provide a better solution
 * for this case
 */

export default {
  name: 'TimelineJob',
  props: {
    job: Object,
    upShiftDisabled: Boolean,
    downShiftDisabled: Boolean,
    isInvalidDate: Boolean
    // isEditing: Boolean
  },
  data () {
    return {
      months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'NOV', 'OCT', 'DEC'],
      editing: false,
      isEditing: false,
      startDate: new Date(),
      endDate: new Date(),
      message: '',
      showMessage: false,
      loadingDelete: false,
      startDateRules: [
        v => new Date(this.endDate) > new Date(v) || 'Start date must be before end date'
      ]
    }
  },
  computed: {
    // startDateRules() {
    //   const rules = []
    //   const rule = () => new Date(this.endDate) > new Date(this.startDate) || 'Start date must be before end date'
    //   rules.push(rule)

    //   return rules
    // },
    endDateRules() {
      const rules = []
      const rule = () => new Date(this.endDate) > new Date(this.startDate) || 'End date must be after start date'
      rules.push(rule)

      return rules
    }
    // isEditing: function () {
    //   return this.editing
    // }
  },
  methods: {
    updateStartDate(job) {
      this.$refs.form.validate()
      this.$emit('update-start-date', { ...job, startDate: this.startDate })
    },
    updateEndDate(job) {
      this.$refs.form.validate()
      this.$emit('update-end-date', { ...job, endDate: this.endDate })
    },
    test() {
      this.$refs.form.resetValidation()
    },
    onSubmit(event) {
      event.preventDefault()

      // do nothing if date is invalid in the list
      if (this.isInvalidDate) {
        this.message = 'Changes cannot be made. Date is invalid.'
        this.showMessage = true

        return
      }

      // do nothing if start or end date is invalid
      const inputIsValid = this.$refs.form.validate()
      if (!inputIsValid) {
        return
      }

      this.$emit('update-timeline-job-date', { jobId: this.job.id, startDate: this.startDate, endDate: this.endDate })
      this.isEditing = false
    },
    removeJobFromTimeline() {
      this.loadingDelete = true
      this.$emit('remove-job-from-timeline', this.job.id)
    },
    toggleEdit() {
      // reset the form if cancelled
      if (this.isEditing) {
        this.$refs.form.resetValidation()
        this.startDate = this.job.startDate
        this.endDate = this.job.endDate
      }
      this.isEditing = !this.isEditing
    },
    formatDate(date) {
      if (!date) return

      const month = parseInt(date.split('-')[1])
      const year = parseInt(date.split('-')[0])

      return `${this.months[month - 1]} ${year}`

      // javascripts default functions aren't giving desired output
      // return `${this.months[new Date(date).getMonth()]} ${new Date(date).getFullYear()}`
    },
    shiftUp (jobId) {
      this.$emit('shift-up', jobId)
    },
    shiftDown(jobId) {
      this.$emit('shift-down', jobId)
    }
  },
  created() {
    this.startDate = this.job.startDate
    this.endDate = this.job.endDate
  }
}
</script>