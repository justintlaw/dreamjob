<template>
  <v-app>
    <Navbar />

    <v-main>
      <Nuxt />
    </v-main>
  </v-app>
</template>

<style scoped>
.nav-header-text {
  color: white !important
}
</style>

<script>
import Navbar from '../components/Navbar'

export default {
  name: 'Layout',
  components: {
    Navbar
  },
  data () {
    return {}
  }
}

</script>

<style scoped>
</style>