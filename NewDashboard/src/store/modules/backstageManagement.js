import { announcementSearch } from '@/api/backstageManagement/announcementManagement'

const state = {
  accountStatusType: accountStatusType,
  announcementMarqueeStatusType: announcementMarqueeStatusType,
  gameAnnouncements: [],
  agentAnnouncements: [],
  marqueeMsg: []
}

const accountStatusType = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const announcementMarqueeStatusType = [{
  key: '0',
  nickname: '__close'
},
{
  key: '1',
  nickname: '__open'
}]

const mutations = {
  SET_ACCOUNT_STATUSTYPE(state) {
    state.accountStatusType = accountStatusType
  },
  SET_ANNOUNCEMENT_MARQUEE_STATUSTYPE(state) {
    state.announcementMarqueeStatusType = announcementMarqueeStatusType
  },
  SET_ANNOUNCEMENTS(state, { gameAnnouncements, agentAnnouncements }) {
    state.gameAnnouncements = gameAnnouncements
    state.agentAnnouncements = agentAnnouncements
  },
  SET_MARQUEE_MESSAGE(state, marqueeMsg) {
    state.marqueeMsg = marqueeMsg
  }
}
const actions = {
  setAccountStatusType({ commit }) {
    commit('SET_ACCOUNT_STATUSTYPE')
  },
  setAnnouncementMarqueeStatusType({ commit }) {
    commit('SET_ANNOUNCEMENT_MARQUEE_STATUSTYPE')
  },
  setAnnouncement({ commit }, respone) {
    const gameAnnouncements = []
    const agentAnnouncements = []
    const bulletinMsg = []
    respone.rows.forEach(element => {
      if (element.is_marquee === '1') {
        bulletinMsg.push(element.content)
      }
      if (element.type === 'game') {
        gameAnnouncements.push(element)
      } else if (element.type === 'agent') {
        agentAnnouncements.push(element)
      }
    })
    commit('SET_MARQUEE_MESSAGE', bulletinMsg)
    commit('SET_ANNOUNCEMENTS', { gameAnnouncements: gameAnnouncements, agentAnnouncements: agentAnnouncements })
  },
  getAnnouncement({ dispatch, commit }) {
    return new Promise((resolve, reject) => {
      announcementSearch({}).then(res => {
        dispatch('setAnnouncement', res)
        resolve(res)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
