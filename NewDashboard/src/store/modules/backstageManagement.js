// import { i18n } from '@/lang/lang'

const state = {
  bulletinMsg: '',
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
  SET_BULLETIN_MSG(state, msg) {
    state.bulletinMsg = msg
  },
  SET_ACCOUNT_STATUS(state) {
    state.accountStatus = status
  },
  SET_ANNOUNCEMENT_MARQUEE(state) {
    state.announcementMarquee = marquee
  }
}
const actions = {
  setBulletinMsg({ commit }, msg) {
    commit('SET_BULLETIN_MSG', msg)
  },
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
