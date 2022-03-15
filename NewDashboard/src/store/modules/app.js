const state = {
  sidebar: {
    opened: localStorage.getItem('sidebarStatus') ? localStorage.getItem('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  agentLevelSidebar: localStorage.getItem('agentLevelSidebarStatus') ? localStorage.getItem('agentLevelSidebarStatus') : true
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    localStorage.getItem('sidebarStatus', state.sidebar.opened)
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    localStorage.setItem('sidebarStatus', false)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_AGENTLEVEL_SIDEBAR: state => {
    state.agentLevelSidebar = !state.agentLevelSidebar
    localStorage.getItem('agentLevelSidebarStatus', state.agentLevelSidebar)
  },
  CLOSE_AGENTLEVEL_SIDEBAR: state => {
    localStorage.setItem('agentLevelSidebarStatus', false)
    state.agentLevelSidebar = false
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ dispatch, commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
    dispatch('closeAgentLevelSideBar')
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  toggleAgentLevelSideBar({ commit }) {
    commit('TOGGLE_AGENTLEVEL_SIDEBAR')
  },
  closeAgentLevelSideBar({ commit }) {
    commit('CLOSE_AGENTLEVEL_SIDEBAR')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
