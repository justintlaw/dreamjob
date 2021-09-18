<!--
TODO:
  - Have the skills keep their ids instead of removing them
  - Fix bug where skills don't know after editing until refresh
  - Clear edits when cancel edit is clicked
  - Updating a jobs skills is working, but this code should be refractored
      to be less error prone
      simplify updateJob/comment it
  - Fix skills so on update the tag is changed immediately (don't wait for the api)
-->
<template>
  <v-card class="my-2">
    <!-- <v-card-title>
      <span v-show="!isEditing" @dblclick="toggleEdit()">{{ job.title }}</span>
      <v-text-field v-show="isEditing" v-model="newJob.title" label="Job Title" placeholder="Enter job title"></v-text-field>
      <v-spacer></v-spacer>
      <v-card-actions>
          <v-btn depressed icon v-show="isEditing" @click="updateJob()">
            <v-icon color="success">mdi-check</v-icon>
          </v-btn>

          <v-btn depressed icon>
            <v-icon v-show="!isEditing" color="secondary" class="pulse-button" @click="toggleEdit()">mdi-briefcase-edit-outline</v-icon>
            <v-icon v-show="isEditing" color="secondary" @click="toggleEdit()">mdi-close</v-icon>
          </v-btn>

          <v-btn depressed icon @click="$emit('delete-job', job.id)">
            <v-icon color="danger">mdi-trash-can-outline</v-icon>
          </v-btn>

          <v-btn @click="toggleShow()" icon depressed>
            <v-icon v-if="selected" large>mdi-chevron-up</v-icon>
            <v-icon v-if="!selected" large>mdi-chevron-down</v-icon>
          </v-btn>

      </v-card-actions>
    </v-card-title>
    <v-card-subtitle>{{ job.location }} @ {{ job.company }}</v-card-subtitle> -->

    <v-layout>
          <v-card-title style="width: 100%">
      <v-row>
        <v-col cols="7" md="9" lg="9" xl="9">
            <div>
              <span class="text-body-1 text-md-h5" v-show="!isEditing" @dblclick="toggleEdit()">{{ job.title }}</span>
              <v-text-field v-show="isEditing" v-model="newJob.title" label="Job Title" placeholder="Enter job title"></v-text-field>
              <v-card-subtitle style="display: block" class="text-caption text-md-subtitle-1 pa-0 pt-1">{{ job.location }} @ {{ job.company }}</v-card-subtitle>
            </div>
        </v-col>

        <v-spacer></v-spacer>

        <v-col cols="5" md="3" lg="3" xl="3" class="px-0">
            <div class="float-right">
              <v-card-actions>
                  <v-btn class="mx-0" depressed icon v-show="isEditing" @click="updateJob()">
                    <v-icon color="success">mdi-check</v-icon>
                  </v-btn>

                  <v-btn @click="toggleEdit()" class="mx-0" depressed icon>
                    <v-icon v-show="!isEditing" color="secondary" class="pulse-button">mdi-briefcase-edit-outline</v-icon>
                    <v-icon v-show="isEditing" color="secondary">mdi-close</v-icon>
                  </v-btn>


                  <v-btn v-show="!isEditing" class="mx-0" depressed icon @click="$emit('delete-job', job.id)">
                    <v-icon color="danger">mdi-trash-can-outline</v-icon>
                  </v-btn>

                  <v-btn class="mx-0" @click="toggleShow()" icon depressed>
                    <v-icon v-if="selected" large>mdi-chevron-up</v-icon>
                    <v-icon v-if="!selected" large>mdi-chevron-down</v-icon>
                  </v-btn>
              </v-card-actions>

              <!-- <v-card-actions>
                <v-fade-transition>
                  <div v-show="isEditing">
                    <v-btn class="mx-0" depressed icon @click="updateJob()">
                      <v-icon color="success">mdi-check</v-icon>
                    </v-btn>
                    <v-btn class="mx-0" depressed icon>
                      <v-icon color="secondary" @click="toggleEdit()">mdi-close</v-icon>
                    </v-btn>
                  </div>
                </v-fade-transition>

                <v-fade-transition>
                  <div v-show="!isEditing">
                    <v-btn class="mx-0" depressed icon>
                      <v-icon color="secondary" class="pulse-button" @click="toggleEdit()">mdi-briefcase-edit-outline</v-icon>
                    </v-btn>
                    <v-btn class="mx-0" depressed icon @click="$emit('delete-job', job.id)">
                      <v-icon color="danger">mdi-trash-can-outline</v-icon>
                    </v-btn>
                  </div>
                </v-fade-transition>

                  <v-btn class="mx-0" @click="toggleShow()" icon depressed>
                    <v-icon v-if="selected" large>mdi-chevron-up</v-icon>
                    <v-icon v-if="!selected" large>mdi-chevron-down</v-icon>
                  </v-btn>
              </v-card-actions> -->
            </div>
        </v-col>
      </v-row>
            
          </v-card-title>

          
    </v-layout>

    <v-expand-transition>
      <div v-show="selected">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="10" lg="10" xl="10">
              <div v-show="!isEditing" @dblclick="toggleEdit()">
                <label class="font-weight-bold" for="description">Description</label>
                <p id="description">{{ job.description }}</p>
              </div>
              <div v-show="isEditing">
                <v-textarea v-model="newJob.description" label="Job Description" hint="Enter details about the job here"></v-textarea>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="6" md="4" lg="4" xl="4">
              <div class="settings">
                <div v-show="!isEditing" @dblclick="toggleEdit()">
                  <label class="font-weight-bold" for="company" style="display: inline-block">Company</label>
                  <div class="font-italic" id="company">
                    {{ job.company }}
                  </div>
                </div>

                <div v-show="isEditing">
                  <v-text-field v-model="newJob.company" label="Company" placeholder="Enter company"></v-text-field>
                </div>

              </div>
            </v-col>
            <v-col cols="6" md="3" lg="3" xl="3">
              <div>
                <div v-show="!isEditing" @dblclick="toggleEdit()">
                  <label class="font-weight-bold" for="location" style="display: inline-block">Location</label>
                  <div class="font-italic" id="location">
                    {{ job.location }}
                  </div>
                </div>

                <div v-show="isEditing">
                  <v-text-field v-model="newJob.location" label="Location" placeholder="Enter location"></v-text-field>
                </div>
              </div>
            </v-col>
            <v-col cols="6" md="3" lg="3" xl="3">
              <div v-show="!isEditing" @dblclick="toggleEdit()">
                <label class="font-weight-bold" for="salary" style="display: inline-block">Salary</label>
                <div class="font-italic" id="salary">
                  {{ job.salary }}
                </div>
              </div>

              <div v-show="isEditing">
                <v-text-field id="salary" type="number" step="1000" v-model="newJob.salary" label="Salary" placeholder="Enter salary"></v-text-field>
              </div>
            </v-col>
            <v-col cols="6" md="4" lg="4" xl="4">
              <div v-show="!isEditing" @dblclick="toggleEdit()">
                <label class="font-weight-bold" for="type" style="display: inline-block">Type</label>
                <div class="font-italic" id="type">
                  {{ job.type }}
                </div>
              </div>

              <div v-show="isEditing">
                <v-select v-model="newJob.type" :items="jobTypes" label="Full/Part Time" solo></v-select>
              </div>
            </v-col>
            <v-col cols="6" md="6" lg="6" xl="6">
              <div v-show="!isEditing" @dblclick="toggleEdit()">
                <label class="font-weight-bold" for="intern" style="display: inline-block">Intern</label>
                <div class="font-italic" id="intern">
                  {{ job.is_intern ? 'Yes' : 'No' }}
                </div>
              </div>

              <div v-show="isEditing">
                <v-switch v-model="newJob.is_intern" label="Internship"></v-switch>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-divider class="mx-5"></v-divider>

        <v-container v-show="!isEditing" @dblclick="toggleEdit()">
          <JobSkills :skills="job.skills" />
        </v-container>

        <v-container v-show="isEditing">
          <v-combobox v-model="newJob.skills" multiple chips deletable-chips label="Job Skills"></v-combobox>
        </v-container>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<style scoped>
.pulse-button {
  -webkit-animation: pulse 1.2s infinite;
}

@-webkit-keyframes pulse {
  0% {
    @include transform(scale(.9));
  }
  70% {
    @include transform(scale(1));
    box-shadow: 0 0 0 50px rgba(#5a99d4, 0);
  }
    100% {
    @include transform(scale(.9));
    box-shadow: 0 0 0 0 rgba(#5a99d4, 0);
  }
}
</style>

<script>
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
  name: 'Job',
  props: {
    job: Object
  },
  data () {
    return {
      selected: false,
      isEditing: false,
      skills: [],
      newJob: { ...this.job },
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
  computed: {
    showJob () {
      return this.selected
    }
  },
  methods: {
    toggleShow () {
      this.selected = !this.selected
    },
    toggleEdit() {
      this.isEditing = !this.isEditing

      if (this.isEditing) {
        this.selected = true
      }

      setTimeout(() => {}, 200)
    },
    updateJob() {
      // re-attach ids to skills that have them
      let oldSkills = this.job.skills
      let newSkills = this.newJob.skills

      newSkills = newSkills.map(skill => {
        let matchingSkillId = (oldSkills
          .find(oldSkill => oldSkill.name === skill))?.id

        if (matchingSkillId) {
          return {
            id: matchingSkillId,
            name: skill
          }
        }
        
        return {
          name: skill
        }
      })

      console.log(JSON.stringify(newSkills))

      this.newJob.skills = [ ...newSkills ]

      this.isEditing = false

      this.$emit('update-job', this.newJob)

      this.newJob.skills = newSkills
        .map(skill => skill.name)
    }
  },
  async mounted() {
    // convert skills to a simple array of string
    // to be used for editing a job
    this.newJob = { ...this.job }
    
    let skills = this.newJob.skills
    skills = skills.map(skill => skill.name)
    console.log(skills)

    this.newJob.skills = skills
  },

}
</script>