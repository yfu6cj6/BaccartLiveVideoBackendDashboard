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
        // 帳號管理
        path: 'accountManagement',
        name: 'AccountManagement',
        component: () => import('@/views/backstageManagement/accountManagement/index'),
        meta: { title: '__accountManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        // 角色管理
        path: 'roleManagement',
        name: 'RoleManagement',
        component: () => import('@/views/backstageManagement/roleManagement/index'),
        meta: { title: '__roleManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        // 權限管理
        path: 'permissionManagement',
        name: 'PermissionManagement',
        component: () => import('@/views/backstageManagement/permissionManagement/index'),
        meta: { title: '__permissionManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        // 時區管理
        path: 'timeZoneManagement',
        name: 'TimeZoneManagement',
        component: () => import('@/views/backstageManagement/timeZoneManagement/index'),
        meta: { title: '__timeZoneManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        // 幣別管理
        path: 'currencyManagement',
        name: 'CurrencyManagement',
        component: () => import('@/views/backstageManagement/currencyManagement/index'),
        meta: { title: '__currencyManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        // 日誌管理
        path: 'operationLogManagement',
        name: 'OperationLogManagement',
        component: () => import('@/views/backstageManagement/operationLogManagement/index'),
        meta: { title: '__operationLogManagement', icon: 'el-icon-user-solid', permission: 1001 }
      },
      {
        // 公告管理
        path: 'announcementManagement',
        name: 'AnnouncementManagement',
        component: () => import('@/views/backstageManagement/announcementManagement/index'),
        meta: { title: '__announcementManagement', icon: 'el-icon-user-solid', permission: 1001 }
      }
    ]
  },

  {
    // 修改密碼
    path: '/passwordReset',
    component: Layout,
    redirect: '/passwordReset',
    meta: { title: '__passwordReset', icon: 'el-icon-user-solid' },
    children: [{
      path: 'passwordReset',
      name: 'PasswordReset',
      component: () => import('@/views/passwordReset/index'),
      meta: { title: '__passwordReset' }
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
