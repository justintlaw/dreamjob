export default {
  install (Vue, options) {
    Vue.prototype.$user = undefined
    Vue.prototype.$authState = undefined

    Vue.user = undefined
    Vue.authState = undefined
  }
}