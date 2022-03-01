const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  account: state => state.user.account,
  agent_id: state => state.user.agent_id,
  agentName: state => state.user.agentName,
  nickname: state => state.user.nickname,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.permission_routes,
  accountStatus: state => state.backstageManagement.accountStatus,
  announcementMarquee: state => state.backstageManagement.announcementMarquee
}
export default getters
