<template>
  <!-- <div>
    test
    <amplify-authenticator v-if="authState !== 'signedin'" class="container">
    <div v-if="authState === 'signedin' && user">
      <h1>Hello, {{user.username}}</h1>
      <button v-on:click="signOut">Sign Out</button>
    </div>
    </amplify-authenticator>
  </div> -->
  <div>
    <amplify-authenticator username-alias="email">
      <amplify-sign-up
        slot="sign-up"
        username-alias="email"
        :form-fields.prop="formFields"
      ></amplify-sign-up>
      <!-- :handleSignUp.prop="signUp"-->
    </amplify-authenticator>
    
    <div v-if="user">
      <v-container>
        <h1 class="text-h1">Welcome<span>{{ name ? `, ${name}` : '' }}</span></h1>
        <p class="text-subtitle-1 pb-0 mb-0">Here are some details about your account.</p>
        <p class="text-subtitle-1 py-0 my-0">{{ email }}</p>
      </v-container>

      <v-container>
        <v-divider></v-divider>
      </v-container>

      <v-container v-if="loading">
        <p>Grabbing your data...</p>
        <v-progress-linear indeterminate color="primary"></v-progress-linear>
      </v-container>

      <div>
        <v-container>
          <v-layout class="d-flex justify-space-between">
            <div>
              <p class="text-h5">Jobs Saved: {{ jobCount }}</p>
            </div>
            <div>
              <p class="text-h5">Timelines: {{ timelineCount }}</p>
            </div>
            <div>
              <p class="text-h5">Skills: {{ skills.length }}</p>
            </div>
          </v-layout>
        </v-container>

        <v-container>
          <h6 class="text-h3 mb-2">Your Skills</h6>

          <v-layout>
            <div class="d-inline-flex">
              <v-text-field v-model="newSkill" label="Enter Skill" single-line outlined elevation="2"></v-text-field>
              <v-btn x-large outlined elevation="2" color="primary" class="ml-2" @click="addSkill">Add</v-btn>
            </div>
          </v-layout>

          <div>
            <div v-for="skill in skills" :key="skill.id" class="d-inline-flex">
              <v-chip x-large close close-icon="mdi-delete" @click:close="removeSkill(skill.name)" class="ma-4">
                <v-icon left>mdi-label</v-icon>
                <span>{{ skill.name }}</span>
              </v-chip>
            </div>
          </div>
        </v-container>
      </div>
    </div>
  </div>
</template>

<script>
import { onAuthUIStateChange, AuthState } from '@aws-amplify/ui-components'
import { Auth, formField }  from 'aws-amplify';
import { API_BASE_URL } from '../../constants'

export default {
  created() {
    onAuthUIStateChange((authState, authData) => {
      this.authState = authState;
      // this.user = authData;
      this.user = user
      // this.$authState = authState
      // this.$state.updateUser()
      this.$store.commit('updateUser', {
        authState,
        authData
      })
      console.log('vuex state', this.$store.state.authState)
      console.log('authState: ', authState)
    })
  },
  data() {
    return {
      loading: true,
      user: null,
      name: '',
      email: '',
      newSkill: '',
      authState: undefined,
      formFields: [
        {
          type: 'name',
          label: 'Name',
          required: true
        },
        {
          type: 'email'
        },
        {
          type: 'password'
        }
      ],
      jobCount: 0,
      timelineCount: 0,
      skills: []
    }
  },
  methods: {
    signUp: async function(formData) {
      try {
        const { user } = await Auth.signUp({
          ...formData,
          attributes: {
            ...formData.attributes
          }
        })
        console.log(user)
      } catch (err) {
        console.error('Error signing up:', err)
      }
      console.log('cognito signed up')

      await this.createUser()
      console.log('user created')
    },
    signOut: async () => Auth.signOut(),
    // TODO
    // Move this to a plugin since it will be used in most pages
    async getUser() {
      this.loading = true

      try {
        this.user = await Auth.currentAuthenticatedUser()
        this.email = this.user.attributes.email
        this.name = this.user.attributes.name
      } catch (err) {
        throw err
      }

      const options = await this.fetchOptions('GET')
      const res = await fetch(`${API_BASE_URL}/users/${this.user.attributes.sub}`, options)

      const data = await res.json()

      this.loading = false

      return data
    },
    async createUser() {
      const options = await this.fetchOptions('POST')
      const res = await fetch(`${API_BASE_URL}/users`, options)
    },
    async addSkill() {
      if (!this.newSkill) return

      const skillToAddIndex = this.skills.findIndex(skill => skill.name === this.newSkill)

      if (skillToAddIndex !== -1) return

      this.skills.push({ name: this.newSkill })

      const options = await this.fetchOptions('POST', JSON.stringify({ skill: this.newSkill }))
      await fetch(`${API_BASE_URL}/users/${this.user.attributes.sub}`, options)

      this.newSkill = ''
    },
    async removeSkill(skillName) {
      const skillToRemoveIndex = this.skills.findIndex(skill => skill.name === skillName)
      this.skills.splice(skillToRemoveIndex, 1)
      const options = await this.fetchOptions('POST', JSON.stringify({ skill: skillName }))
      await fetch(`${API_BASE_URL}/users/${this.user.attributes.sub}/removeSkill`, options)
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
  beforeDestroy() {
    return onAuthUIStateChange;
  },
  async created() {
    try {
      const data = await this.getUser()

      this.jobCount = data.jobCount
      this.timelineCount = data.timelineCount
      this.skills = data.skills
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
}

:root {
  --amplify-primary-color: #4287f5;
  --amplify-primary-tint: #005cf0;
  --amplify-primary-shade: #005cf0;
}
</style>