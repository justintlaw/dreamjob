<!--
- Desktop drawer uses normal app bar
- mobile should use collapse nav drawers
- consider refractoring to use just the nav drawer
  and mini attribute
-->

<template>
  <nav>
    <v-app-bar app color="primary">
      <!-- drawer for use in mobile -->
      <v-app-bar-nav-icon class="d-flex d-md-none" color="white" @click="drawer=true"></v-app-bar-nav-icon>

      <v-toolbar-title class="text-uppercase grey--text">
        <span class="font-weight-light white--text">Dream</span>
        <span class="white--text">Job</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Hide buttons on mobile, instead use nav drawer -->
      <v-toolbar-items class="d-none d-md-flex">
        <v-btn to="/" class="no-active px-10 primary" active-class="no-active" depressed x-large nuxt>
          <v-icon size="25" left>mdi-home-outline</v-icon>
          <span>Home</span>
        </v-btn>
        <v-btn to="/jobs" class="no-active px-10 primary" depressed x-large nuxt>
          <v-icon>mdi-briefcase-outline</v-icon>
          <span class="pl-1">Jobs</span>
        </v-btn>
        <v-btn to="/profile" class="no-active px-10 primary" depressed x-large nuxt>
          <v-icon>mdi-account-outline</v-icon>
          <span class="pl-1">Profile</span>
        </v-btn>
        <v-btn to="/timeline" class="no-active px-10 primary" depressed x-large nuxt>
          <v-icon>mdi-map-outline</v-icon>
          <span class="pl-1">MyPlan</span>
        </v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <v-btn v-show="isSignedIn" class="primary" depressed right @click="signOut">
        <span>Sign Out</span>
        <v-icon right>mdi-exit-to-app</v-icon>
        <!-- <amplify-sign-out></amplify-sign-out> -->
      </v-btn>

      <v-btn v-show="!isSignedIn" to="/profile" class="no-active primary" depressed right nuxt>
        <span>Sign In</span>
        <v-icon right>mdi-exit-to-app</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- drawer display for mobile -->
    <v-navigation-drawer v-model="drawer" absolute temporary>
      <v-list nav dense>
        <v-list-item-group v-model="group">
          <v-list-item to="/" nuxt>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/jobs" nuxt>
            <v-list-item-icon>
              <v-icon>mdi-briefcase</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Jobs</v-list-item-title>
          </v-list-item>

          <v-list-item to="/profile" nuxt>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Profile</v-list-item-title>
          </v-list-item>

          <v-list-item to="/timeline" nuxt>
            <v-list-item-icon>
              <v-icon>mdi-map</v-icon>
            </v-list-item-icon>
            <v-list-item-title>MyPlan</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<style scoped>
.v-btn--active.no-active::before {                                                                             
  opacity: 0 !important;
}

.v-btn--active:hover::before {
  opacity: 0.08 !important;
}
</style>

<script>
import { onAuthUIStateChange } from '@aws-amplify/ui-components'
import { Auth } from 'aws-amplify'

export default {
  data() {
    return {
      drawer: false,
      group: null,
      user: undefined,
      authState: undefined
    }
  },
  created() {
    onAuthUIStateChange((authState, authData) => {
      // this.authState = authState
      // this.user = authData
      this.$store.commit('updateUser', {
        authState,
        authData
      })
    })
  },
  methods: {
    // signOut: async function () {
    //   await Auth.signOut()

    //   // Docs aren't clear on where to update authstate async
    //   // so just do it manually for now
    //   // probably import AuthState
    //   // this.authState = undefined
    //   // this.user = undefined
    //   // console.log('navbar auth:', this.authState)

    //   // this.$store.commit('updateUser', {
    //   //   authState,
    //   //   authData
    //   // })

    //   // this.$router.push('/')
    //   await this.$forceUpdate()
    // }
    signOut: function async () {
      this.$store.commit('logout')
      Auth.signOut()
    }
  },
  computed: {
    currentAuthState: function () {
      return this.$store.state.authState
    },
    isSignedIn: function () {
      return this.currentAuthState === 'signedin'
    }
  },
  beforeDestroy() {
    return onAuthUIStateChange
  }
}
</script>