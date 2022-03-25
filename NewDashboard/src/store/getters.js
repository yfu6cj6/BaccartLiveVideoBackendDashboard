const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  agentLevelSidebar: state => state.agentManagement.agentLevelSidebar,
  agentLevel: state => state.agentManagement.agentLevel,
  agentId: state => state.agentManagement.agentId,
  agentLevelLoading: state => state.agentManagement.agentLevelLoading,
  agentLevelExpandedKeys: state => state.agentManagement.agentLevelExpandedKeys,
  fixedHeader: state => state.settings.fixedHeader,
  sidebarLogo: state => state.settings.sidebarLogo,
  tagsView: state => state.settings.tagsView,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  accountStatusType: state => state.common.accountStatusType,
  announcementMarqueeStatusType: state => state.common.announcementMarqueeStatusType,
  roles: state => state.common.roles,
  statusType: state => state.common.statusType,
  account: state => state.user.account,
  agent_id: state => state.user.agent_id,
  agentName: state => state.user.agentName,
  nickname: state => state.user.nickname,
  permissions: state => state.user.permissions,
  balance: state => state.user.balance,
  agentFullName: state => state.user.agentFullName,
  permission_routes: state => state.permission.permission_routes,
  marqueeMsg: state => state.backstageManagement.marqueeMsg,
  gameAnnouncements: state => state.backstageManagement.gameAnnouncements,
  agentAnnouncements: state => state.backstageManagement.agentAnnouncements,
  memberBetTimeType: state => state.memberBet.memberBetTimeType,
  gameResultTimeType: state => state.gameResult.gameResultTimeType
}
export default getters
