<template>
<div>
  <p>{{ JSON.stringify(timelines[0]) }}</p>
  <Test :timeline="timelines[0]"/>
  <button @click="update">Click Me</button>
</div>
</template>

<script>
import Test from '../../components/Test'
export default {
  data () {
    return {
      timelines: [
        {
          title: 'Timeline 1',
          jobs: [
            {
              title: 'Test Job 1'
            }
          ]
        }
      ]
    }
  },
  methods: {
    update: function() {
      this.timelines[0].jobs.push({ title: 'Test Job 2' })
    }
  }
}
</script>