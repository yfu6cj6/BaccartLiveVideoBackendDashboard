const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  device: state => state.app.device,
  userId: state => state.user.id,
  token: state => state.user.token,
  name: state => state.user.name,
  account: state => state.user.account,
  role: state => state.user.role,
  agentId: state => state.user.agentId,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  accountListData: state => state.backstage.accountListData,
  accountCreateAgentRole: state => state.backstage.accountCreateAgentRole,
  customerServiceListData: state => state.customerServiceManage.customerServiceListData
}
export default getters
