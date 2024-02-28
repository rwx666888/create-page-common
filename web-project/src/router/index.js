import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/layout'

Vue.use(Router)

/* Router Modules */

/**
 * Note: sub-menu only appear when route children.length >= 1
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    sort:0                       enable UAC to control menu ordering
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    name: 'Error404',
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/create/index'),
        name: 'CreateIndex',
        meta: { title: '初始化项目', icon: 'icon', noCache: false }
      }
    ]
  },
  {
    path: '/create',
    component: Layout,
    meta: { title: '创建', icon: 'list', noCache: true },
    children: [
      {
        path: 'create-list',
        component: () => import('@/views/create/create-list'),
        name: 'CreateList',
        meta: { title: '创建列表页', icon: 'list', noCache: true }
      },
      {
        path: 'create-info',
        component: () => import('@/views/create/create-info'),
        name: 'CreateInfo',
        meta: { title: '创建详情页', icon: 'list', noCache: true }
      },
      {
        path: 'create-form',
        component: () => import('@/views/create/create-form'),
        name: 'CreateInfo',
        meta: { title: '创建表单页', icon: 'list', noCache: true }
      }
    ]
  },
  {
    path: '/help',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/help/index'),
        name: 'HelpIndex',
        meta: { title: '使用帮助', icon: 'el-icon-help', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  {
    path: '/error',
    component: Layout,
    redirect: 'noRedirect',
    name: 'ErrorPages',
    meta: {
      title: 'Error Pages',
      icon: '404'
    },
    children: [
      {
        path: '404',
        component: () => import('@/views/error-page/404'),
        name: 'Page404',
        meta: { title: '404', noCache: true }
      }
    ]
  },
  {
    path: '/test',
    component: Layout,
    meta: {
      sort: 0,
      title: 'testDemo',
      icon: 'bug'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/test/index'),
        name: 'testIndex',
        meta: { title: 'test', icon: 'bug' }
      },
      {
        path: 'table',
        component: () => import('@/views/test/table'),
        name: 'testTable',
        meta: { title: 'table', icon: 'bug' }
      },
      {
        path: 'test02',
        component: () => import('@/views/create/components/form-item-valid'),
        name: 'test02',
        meta: { title: 'test02', icon: 'bug' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true, meta: { sort: 0 } }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// warning :Duplicate named routes definition
export function selfaddRoutes (params) {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
  router.addRoutes(params)
}

export default router
