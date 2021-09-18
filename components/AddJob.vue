<!--
TODO:
  - Add validation to form
  - Check that form is valid before submitting
  - Use constants and templates for data (particularly job data)
  - Fix default value not being set for job type
  - fix stepper not all steps cancel is working
  - Data not clearing when job added FIXED: issue was that the object was being written into newJob instead of deconstructed
    Completely bugged out cancelling job or wiping data after being posted
-->

<template>
  <v-stepper v-model="currentStep">
    <v-stepper-header>
      <v-stepper-step :complete="currentStep > 1" step="1">
        Basic Info
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="currentStep > 2" step="2">
        Description
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="currentStep > 3" step="3">
        Skills
      </v-stepper-step>
      <v-divider></v-divider>
      <v-stepper-step :complete="currentStep > 4" step="4">
        Confirm
      </v-stepper-step>
    </v-stepper-header>

    <v-form @submit="onSubmit">
    <v-stepper-items>
      <v-stepper-content step="1">
        <v-card class="mb-12" color="grey lighten-4"  min-height="200">
          <v-container>
            <v-row>
              <v-col cols="12" md="4" lg="4" xl="4">
                <v-text-field v-model="newJob.title" label="Job Title" placeholder="Enter job title" clearable
                  :error-messages="titleErrors"
                  :counter="30"
                  @input="$v.newJob.title.$touch()"
                  @blur="$v.newJob.title.$touch()"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" lg="4" xl="4">
                <v-text-field id="location" v-model="newJob.location" label="Location" placeholder="Enter job location" clearable
                  :error-messages="locationErrors"
                  @input="$v.newJob.location.$touch()"
                  @blur="$v.newJob.location.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="4" lg="4" xl="4">
                <v-text-field id="company" v-model="newJob.company" label="Company" placeholder="Enter company" clearable
                  :error-messages="companyErrors"
                  @input="$v.newJob.company.$touch()"
                  @blur="$v.newJob.company.$touch()"
                  required
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-text-field id="salary" type="number" step="1000" v-model="newJob.salary" label="Salary" placeholder="Enter salary" clearable
                  :error-messages="salaryErrors"
                  @input="$v.newJob.salary.$touch()"
                  @blur="$v.newJob.salary.$touch()"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-menu :close-on-content-click="false" :nudge-right="40" transition="scale-transition" offset-y min-width="auto">
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field v-model="newJob.post_date" label="Date Job Posted" append-outer-icon="mdi-calendar" v-bind="attrs" v-on="on"
                      :error-messages="postDateErrors"
                      @input="$v.newJob.post_date.$touch()"
                      @blur="$v.newJob.post_date.$touch()"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="newJob.post_date"></v-date-picker>
                </v-menu>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-select v-model="newJob.type" :items="jobTypes" label="Full or Part Time" solo
                  :error-messages="jobTypeErrors"
                  @input="$v.newJob.type.$touch()"
                  @blur="$v.newJob.type.$touch()"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" md="6" lg="6" xl="6">
                <v-switch v-model="newJob.is_intern" label="Internship" hint="Check this box for internships" persistent-hint
                  :error-messages="isInternErrors"
                  @input="$v.newJob.is_intern.$touch()"
                  @blur="$v.newJob.is_intern.$touch()"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card>

        <v-btn color="primary" @click="currentStep = 2">
          Continue
        </v-btn>

        <v-btn text @click="cancelCreate">
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card class="mb-12" color="grey lighten-4" min-height="200">
          <v-container>
            <v-textarea v-model="newJob.description" label="Job Description" hint="Enter details about the job here"
              :error-message="descriptionErrors"
              @input="$v.newJob.description.$touch()"
              @blur="$v.newJob.description.$touch()"
            ></v-textarea>
          </v-container>
        </v-card>

        <v-btn color="primary" @click="currentStep = 3">
          Continue
        </v-btn>

        <v-btn text @click="cancelCreate">
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card class="mb-12" color="grey lighten-4" min-height="200">
          <v-container>
            <v-combobox v-model="newJob.skills" multiple chips deletable-chips label="Job Skills"
              :error-messages="skillsErrors"
              @input="$v.newJob.skills.$touch()"
              @blur="$v.newJob.skills.$touch()"
              required
            ></v-combobox>
          </v-container>
        </v-card>

        <v-btn color="primary" @click="currentStep = 4">
          Continue
        </v-btn>

        <v-btn text @click="cancelCreate">
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-card class="mb-12" color="grey lighten-4" min-height="200">
          <v-row class="pa-2">
            <v-col cols="6">
              <p>Job Title: {{ newJob.title }}</p>
              <p>Location: {{ newJob.location }}</p>
              <p>Company: {{ newJob.company }}</p>
              <p>Posted Date: {{ newJob.post_date }}</p>
            </v-col>
            <v-col cols="6">
              <p>Salary: {{ newJob.salary }}</p>
              <p>Type: {{ newJob.type }}</p>
              <p>Internship: {{ newJob.is_intern ? 'Yes' : 'No' }}</p>
            </v-col>
          </v-row>

          <v-divider class="my-2 mx-6"></v-divider>

          <div class="pa-2">
            <p>Skills:<p>

              <div v-for="(skill, index) in newJob.skills" :key="`skill-${index}`" class="d-inline-flex">
                <v-chip label class="ma-1">
                  <v-icon left>mdi-label</v-icon>
                  <span>{{ skill }}</span>
                </v-chip>
              </div>
          </div>
        </v-card>

        <v-btn color="success" type="submit">
          Add Job
        </v-btn>

        <!-- <v-btn text @click="$emit('cancel-add')"> -->
        <v-btn text @click="cancelCreate">
          Cancel
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-form>
  </v-stepper>
</template>

<script>
import { validationMixin } from 'vuelidate'
import {
  required,
  minLength,
  maxLength,
  email,
  between 
} from 'vuelidate/lib/validators'

const JobTemplate = {
  title: '',
  location: '',
  description: '',
  salary: '',
  company: '',
  type: 'Full-time',
  is_intern: false,
  post_date: '',
  skills: [] 
}

export default {
  name: 'AddJob',
  mixins: [validationMixin],
  validations: {
    newJob: {
      title: {
        required,
        maxLength: maxLength(30)
      },
      location: {
        maxLength: maxLength(30)
      },
      company: {
        required,
        maxLength: maxLength(30)
      },
      type: {
        required
      },
      salary: {
        between: between(0, 1000000)
      },
      post_date: {
        // we need to validate it is a date as well
      },
      is_intern: {

      },
      description: {
        maxLength: maxLength(1000)
      },
      skills: {
        required,
        // $each: {
        //   maxLength: maxLength(30)
        // }
      }
    },
  },
  computed: {
    titleErrors () {
      const errors = []
      if (!this.$v.newJob.title.$dirty) return errors
      !this.$v.newJob.title.maxLength && errors.push('Job title length cannot be more than 30 characters long.')
      !this.$v.newJob.title.required && errors.push('Job title is required.')
      return errors
    },
    locationErrors() {
      const errors = []
      if (!this.$v.newJob.location.$dirty) return errors
      !this.$v.newJob.location.maxLength && errors.push('Location cannot be more than 30 characters long.')
      return errors
    },
    companyErrors() {
      const errors = []
      if (!this.$v.newJob.company.$dirty) return errors
      !this.$v.newJob.company.maxLength && errors.push('Company cannot be more than 30 characters long.')
      !this.$v.newJob.company.required && errors.push('Company is required')
      return errors
    },
    salaryErrors() {
      const errors = []
      if (!this.$v.newJob.salary.$dirty) return errors
      !this.$v.newJob.salary.between && errors.push('Salary must be between $0 and $1,000,000.')
      return errors
    },
    postDateErrors() {
      const errors = []
      if (!this.$v.newJob.post_date.$dirty) return errors
      // !this.$v.newJob.post_date.required && errors.push('Post date is required.')
      return errors
    },
    jobTypeErrors() {
      const errors = []
      if (!this.$v.newJob.type.$dirty) return errors
      !this.$v.newJob.type.required && errors.push('Job type is required.')
      return errors
    },
    isInternErrors() {
       const errors = []
      if (!this.$v.newJob.is_intern.$dirty) return errors
      // !this.$v.newJob.is_intern.required && errors.push('Intern box must have a response.')
      return errors
    },
    descriptionErrors() {
      const errors = []
      if (!this.$v.newJob.description.$dirty) return errors
      !this.$v.newJob.description.maxLength && errors.push('A job description cannot be more than 1000 characters.')
      return errors
    },
    skillsErrors() {
      const errors = []
      if (!this.$v.newJob.skills.$dirty) return errors
      !this.$v.newJob.skills.required && errors.push('A job must have at least one skill.')
      // !this.$v.newJob.skills.maxLength && errors.push('A skill name length must be 30 characters or less.')
      return errors
    }
  },
  data () {
    return {
      title: '',
      newJob: {
        title: '',
        location: '',
        description: '',
        salary: '',
        company: '',
        type: 'Full-time',
        is_intern: false,
        post_date: '',
        skills: [] 
      },
      currentStep: 1,
      jobTypes: [
        {
          text: 'Full-time',
          value: 'full-time'
        },
        {
          text: 'Part-time',
          value: 'part-time'
        }
      ]
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()

      // check if form is valid and return to the earliest invalid step
      if (this.$v.$invalid) {
        this.$v.$touch()

        // check step one first
        let jobToValidate = this.$v.newJob

        if (
          jobToValidate.title.$invalid ||
          jobToValidate.location.$invalid ||
          jobToValidate.company.$invalid ||
          jobToValidate.salary.$invalid ||
          jobToValidate.post_date.$invalid ||
          jobToValidate.type.$invalid ||
          jobToValidate.is_intern.$invalid
        ) {
          this.currentStep = 1
        }

        // check for errors in step two
        else if (jobToValidate.description.$invalid) {
          this.currentStep = 2
        }

        // check for errors in step three
        else {
          this.currentStep = 3
        }

        // // use this for skills
        // if (this.$v.newJob.skills.$invalid) {
        //   this.$v.newJob.skills.$touch()
        //   this.currentStep = 3
        // }
        // // use this for description
        // else if (this.$v.newJob.description.$invalid) {
        //   this.currentStep = 2
        // }
        // else {
        //   this.currentStep = 1
        // }
        // // cancel for now
        // // we will need to return the user to the first
        // // step where an error is occuring
        // // console.log(this.$v.title.$invalid)
        return
      }

      // change the skills to an array of objects with a "name" property
      if (this.newJob.skills.length > 0) {
        this.newJob.skills = this.newJob.skills
          .map(s => {
            return {
              name:  s
            }
          })
      }

      // // temp
      // const jobToAdd = this.newJob
      // this.cancelCreate()
      // this.$emit('add-job', jobToAdd)
      // // end temp

      this.$emit('add-job', this.newJob)

      // consider renaming // might not be working
      this.cancelCreate()
    },
    cancelCreate() {
      // we need to deconstruct the object into newJob to avoid overwriting the template
      this.newJob = { ...JobTemplate }

      // reset the validation
      this.$v.$reset()

      console.log(JSON.stringify(this.newJob))
      console.log(JSON.stringify(JobTemplate))
      this.currentStep = 1
      this.$emit('cancel-add')
    }
  }
}
</script>
