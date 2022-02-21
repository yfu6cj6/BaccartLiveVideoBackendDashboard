import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    meta: { title: '__homePage', icon: 'el-icon-s-home' },
    children: [{
      path: 'home',
      name: 'Home',
      component: () => import('@/views/home/index'),
      meta: { title: '__homePage' }
    }]
  }
]

export const asyncRoutes = [
  {
    path: '/backstageManagement',
    component: Layout,
    redirect: '/',
    name: 'backstageManagement',
    meta: { title: '__backstageManagement', icon: 'el-icon-document', permission: 1000 },
    children: [
      {
        path: 'authorityManagement',
        name: 'AuthorityManagement',
        component: () => import('@/views/backstageManagement/authorityManagement/index'),
        meta: { title: '__authorityManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        path: 'timeZoneManagement',
        name: 'TimeZoneManagement',
        component: () => import('@/views/backstageManagement/timeZoneManagement/index'),
        meta: { title: '__timeZoneManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        path: 'accountManagement',
        name: 'AccountManagement',
        component: () => import('@/views/backstageManagement/accountManagement/index'),
        meta: { title: '__accountManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        path: 'announcementManagement',
        name: 'AnnouncementManagement',
        component: () => import('@/views/backstageManagement/announcementManagement/index'),
        meta: { title: '__announcementManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        path: 'systemManagement',
        name: 'SystemManagement',
        component: () => import('@/views/backstageManagement/systemManagement/index'),
        meta: { title: '__systemManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        path: 'passwordReset',
        name: 'PasswordReset',
        component: () => import('@/views/backstageManagement/passwordReset/index'),
        meta: { title: '__passwordReset', icon: 'el-icon-user-solid', permission: 1004 }
      },
      {
        path: 'userAPI',
        name: 'UserAPI',
        component: () => import('@/views/backstageManagement/userAPI/index'),
        meta: { title: '__userAPI', icon: 'el-icon-user-solid', permission: 1001 }
      }
    ]
  },

  {
    path: '/operation',
    component: Layout,
    redirect: '/',
    name: 'Operation',
    meta: { title: '__operationManage', icon: 'el-icon-bangzhu', permission: 1200 },
    children: [
      {
        path: 'member',
        name: 'Member',
        component: () => import('@/views/operation/member/index'), // Parent router-view
        meta: { title: '__member', icon: 'el-icon-s-custom', permission: 1210 },
        children: [
          {
            path: 'memberMessage',
            name: 'MemberMessage',
            component: () => import('@/views/operation/member/memberMessage/index'),
            meta: { title: '__memberMessage', icon: 'el-icon-user-solid', permission: 1211 }
          },
          {
            path: 'memberBetRecord',
            name: 'MemberBetRecord',
            component: () => import('@/views/operation/member/betRecord/index'),
            meta: { title: '__betRecord', icon: 'el-icon-user-solid', permission: 1212 }
          },
          {
            path: 'memberTransactionRecord',
            name: 'MemberTransactionRecord',
            component: () => import('@/views/operation/member/transactionRecord/index'),
            meta: { title: '__transactionRecord', icon: 'el-icon-user-solid', permission: 1213 }
          },
          {
            path: 'memberGameResult',
            name: 'MemberGameResult',
            component: () => import('@/views/operation/member/gameResult/index'),
            meta: { title: '__gameResult', icon: 'el-icon-user-solid', permission: 1214 }
          }
        ]
      },
      {
        path: 'agent',
        name: 'Agent',
        component: () => import('@/views/operation/agent/index'), // Parent router-view
        meta: { title: '__agent', icon: 'el-icon-office-building', permission: 1220 },
        children: [
          {
            path: 'agentCreate',
            name: 'AgentCreate',
            component: () => import('@/views/operation/agent/agentCreate/index'),
            meta: { title: '__agentCreate', icon: 'el-icon-user-solid', permission: 1221 }
          },
          {
            path: 'agentReport',
            name: 'AgentReport',
            component: () => import('@/views/operation/agent/agentReport/index'),
            meta: { title: '__agentReport', icon: 'el-icon-user-solid', permission: 1222 }
          },
          {
            path: 'agentManage',
            name: 'AgentManage',
            component: () => import('@/views/operation/agent/agentManage/index'),
            meta: { title: '__agentManage', icon: 'el-icon-user-solid', permission: 1223 }
          }
        ]
      }
    ]
  },

  {
    path: '/logout',
    name: 'Logout',
    component: () => import('@/views/logout/index'),
    meta: { title: '__logout', icon: 'link' }
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
