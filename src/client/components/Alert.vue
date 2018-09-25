<template>
  <div class="center-align">
    <div>
      <div v-show="alerts.success" class="green lighten-4 green-text text-darken-4 chip">
        {{ alerts.success }}
        <i class="close material-icons">close</i>
      </div>
    </div>
    <div>
      <div v-show="alerts.info" class="blue lighten-4 blue-text text-darken-4 chip">
        {{ alerts.info }}
        <i class="close material-icons">close</i>
      </div>
    </div>
    <div>
      <div v-show="alerts.warning" class="yellow lighten-4 yellow-text text-darken-4 chip">
        {{ alerts.warning }}
        <i class="close material-icons">close</i>
      </div>
    </div>
    <div>
      <div v-show="alerts.error" class="red lighten-4 red-text text-darken-4 chip">
        {{ alerts.error }}
        <i class="close material-icons">close</i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'alert',
  props: [
    'alerts',
  ],
  data() {
    return {};
  },
}
</script>

<style scoped>
</style>
