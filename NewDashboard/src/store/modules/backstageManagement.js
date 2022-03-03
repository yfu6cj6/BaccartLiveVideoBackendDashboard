const state = {
  accountStatus: status,
  announcementMarquee: marquee,
  gameAnnouncements: [],
  agentAnnouncements: []
}

const status = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const marquee = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const mutations = {
  SET_ACCOUNT_STATUS(state) {
    state.accountStatus = status
  },
  SET_ANNOUNCEMENT_MARQUEE(state) {
    state.announcementMarquee = marquee
  },
  SET_ANNOUNCEMENTS(state, { gameAnnouncements, agentAnnouncements }) {
    state.gameAnnouncements = gameAnnouncements
    state.agentAnnouncements = agentAnnouncements
  }
}
const actions = {
  setAccountStatus({ commit }) {
    commit('SET_ACCOUNT_STATUS')
  },
  setAnnouncementMarquee({ commit }) {
    commit('SET_ANNOUNCEMENT_MARQUEE')
  },
  setAnnouncements({ commit }, { gameAnnouncements, agentAnnouncements }) {
    commit('SET_ANNOUNCEMENTS', { gameAnnouncements, agentAnnouncements })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
