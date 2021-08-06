<template>
  <p>{{ JSON.stringify(timeline) }}</p>
</template>

<script>
export default {
  name: 'Test',
  props: {
    timeline: Object
  }
}
</script>