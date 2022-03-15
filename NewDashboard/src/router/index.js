import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

import store from '@/store'

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
    // 後台管理
    path: '/backstageManagement',
    component: Layout,
    redirect: '/',
    name: 'backstageManagement',
    meta: { title: '__backstageManagement', icon: 'el-icon-s-management', permission: 'BackStageManage' },
    displayChildren: true,
    children: [
      {
        // 限紅管理
        path: 'limitManagement',
        name: 'LimitManagement',
        component: () => import('@/views/backstageManagement/limitManagement/index'),
        meta: { title: '__limitManagement', icon: 'el-icon-coin', permission: 'BackStageManage.CurrencyManage' }
      },
      {
        // 遊戲桌管理
        path: 'gameTableManagement',
        name: 'GameTableManagement',
        component: () => import('@/views/backstageManagement/gameTableManagement/index'),
        meta: { title: '__gameTableManagement', icon: 'user', permission: 'BackStageManage.CurrencyManage' }
      },
      {
        // 帳號管理
        path: 'accountManagement',
        name: 'AccountManagement',
        component: () => import('@/views/backstageManagement/accountManagement/index'),
        meta: { title: '__accountManagement', icon: 'el-icon-postcard', permission: 'BackStageManage.AccountManage' }
      },
      {
        // 角色管理
        path: 'roleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/backstageManagement/roleManagement/index'),
        meta: { title: '__roleManagement', icon: 'people', permission: 'BackStageManage.RoleManage' }
      },
      {
        // 權限管理
        path: 'permissionManagement',
        name: 'PermissionManagement',
        component: () => import('@/views/backstageManagement/permissionManagement/index'),
        meta: { title: '__permissionManagement', icon: 'el-icon-s-check', permission: 'BackStageManage.PermissionManage' }
      },
      {
        // 時區管理
        path: 'timeZoneManagement',
        name: 'TimeZoneManagement',
        component: () => import('@/views/backstageManagement/timeZoneManagement/index'),
        meta: { title: '__timeZoneManagement', icon: 'international', permission: 'BackStageManage.TimeZoneManage' }
      },
      {
        // 幣別管理
        path: 'currencyManagement',
        name: 'CurrencyManagement',
        component: () => import('@/views/backstageManagement/currencyManagement/index'),
        meta: { title: '__currencyManagement', icon: 'money', permission: 'BackStageManage.CurrencyManage' }
      },
      {
        // 公告管理
        path: 'announcementManagement',
        name: 'AnnouncementManagement',
        component: () => import('@/views/backstageManagement/announcementManagement/index'),
        meta: { title: '__announcementManagement', icon: 'el-icon-s-order', permission: 'BackStageManage.AnnouncementManage' }
      }
    ]
  },

  {
    // 日誌管理
    path: '/logManagement',
    component: Layout,
    redirect: '/logManagement',
    meta: { title: '__logManagement', icon: 'el-icon-notebook-2', permission: 'LogManage' },
    displayChildren: true,
    children: [{
      // 操作日誌
      path: 'operationLog',
      name: 'OperationLog',
      component: () => import('@/views/logManagement/operationLog/index'),
      meta: { title: '__operationLog', icon: 'el-icon-document', permission: 'LogManage.OperationLog' }
    }]
  },

  {
    // 代理管理
    path: '/agentManagement',
    component: Layout,
    redirect: '/agentManagement',
    meta: { title: '__agentManagement', icon: 'tree', permission: 'LogManage' },
    children: [{
      path: 'agentManagement',
      name: 'AgentManagement',
      component: () => import('@/views/agentManagement/index'),
      meta: { title: '__agentManagement' },
      click: () => { store.dispatch('app/toggleAgentLevelSideBar') }
    }]
  },

  {
    // 投注紀錄
    path: '/memberBet',
    component: Layout,
    redirect: '/memberBet',
    meta: { title: '__memberBet', icon: 'el-icon-tickets', permission: 'WhitelistManage' },
    children: [{
      path: 'memberBet',
      name: 'MemberBet',
      component: () => import('@/views/memberBet/index'),
      meta: { title: '__memberBet' }
    }]
  },

  {
    // 遊戲結果
    path: '/gameResult',
    component: Layout,
    redirect: '/gameResult',
    meta: { title: '__gameResult', icon: 'el-icon-c-scale-to-original', permission: 'WhitelistManage' },
    children: [{
      path: 'gameResult',
      name: 'GameResult',
      component: () => import('@/views/gameResult/index'),
      meta: { title: '__gameResult' }
    }]
  },

  {
    // IP白名單
    path: '/ipWhitelist',
    component: Layout,
    redirect: '/ipWhitelist',
    meta: { title: '__ipWhitelist', icon: 'peoples', permission: 'WhitelistManage' },
    children: [{
      path: 'ipWhitelist',
      name: 'IpWhitelist',
      component: () => import('@/views/ipWhitelist/index'),
      meta: { title: '__ipWhitelist' }
    }]
  },

  {
    // 修改密碼
    path: '/passwordReset',
    component: Layout,
    redirect: '/passwordReset',
    meta: { title: '__modPassword', icon: 'password', permission: 'ModPassword' },
    children: [{
      path: 'modPassword',
      name: 'ModPassword',
      component: () => import('@/views/modPassword/index'),
      meta: { title: '__modPassword' }
    }]
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
