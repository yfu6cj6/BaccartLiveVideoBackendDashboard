import { announcementSearch } from '@/api/backstageManagement/announcementManagement'

const state = {
  gameAnnouncements: [],
  agentAnnouncements: [],
  marqueeMsg: []
}

const mutations = {
  SET_ANNOUNCEMENTS(state, { gameAnnouncements, agentAnnouncements }) {
    state.gameAnnouncements = gameAnnouncements
    state.agentAnnouncements = agentAnnouncements
  },
  SET_MARQUEE_MESSAGE(state, marqueeMsg) {
    state.marqueeMsg = marqueeMsg
  }
}
const actions = {
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
