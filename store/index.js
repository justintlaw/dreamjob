/**
 *  TODO
 *    - move the jobs list to its own Vuex state
 * 
 */

export const state = () => ({
  authState: null,
  user: null
})

export const mutations = {
  login (state, payload) {
    state.authState = payload.authState
    state.user = payload.user
  },
  logout (state) {
    state.authState = null,
    state.user = null
  },
  updateUser (state, payload) {
    state.authState = payload.authState
    state.user = payload.authData
  }
}