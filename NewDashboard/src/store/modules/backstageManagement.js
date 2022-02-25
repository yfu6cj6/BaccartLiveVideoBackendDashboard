// import { i18n } from '@/lang/lang'

const state = {
  accountStatus: status,
  announcementMarquee: marquee
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
  }
}
const actions = {
  setAccountStatus({ commit }) {
    commit('SET_ACCOUNT_STATUS')
  },
  setAnnouncementMarquee({ commit }) {
    commit('SET_ANNOUNCEMENT_MARQUEE')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
