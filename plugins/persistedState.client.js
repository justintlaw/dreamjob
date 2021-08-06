import createPersistedState from 'vuex-persistedState'

export default ({ store }) => {
  createPersistedState({
    key: 'vuex',
    storage: window.localStorage
  }) (store)
}