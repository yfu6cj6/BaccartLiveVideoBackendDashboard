const getters = {
  sidebar: state => state.app.sidebar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  device: state => state.app.device,
  userId: state => state.user.id,
  token: state => state.user.token,
  account: state => state.user.account,
  role: state => state.user.role,
  agentId: state => state.user.agentId,
  permissions: state => state.user.permissions,
  permission_routes: state => state.permission.routes,
  accountListData: state => state.backstage.accountListData,
  accountCreateAgentRole: state => state.backstage.accountCreateAgentRole,
  customerServiceListData: state => state.customerServiceManage.customerServiceListData,
  accountType: state => state.operation_member.accountType,
  memberInfos: state => state.operation_member.memberInfos,
  memberBetRecords: state => state.operation_member.memberBetRecords,
  orderBy: state => state.operation_member.orderBy,
  orderByCondition_bet_record: state => state.operation_member.orderByCondition_bet_record
}
export default getters
