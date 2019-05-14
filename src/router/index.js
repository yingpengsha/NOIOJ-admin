import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/package',
    component: Layout,
    redirect: '/package/index',
    name: 'Package',
    meta: { title: '题包管理', icon: 'table' },
    children: [
      {
        path: 'detail/:id',
        name: 'PackageDetail',
        hidden: true,
        component: () => import('@/views/package/detail'),
        meta: { title: '题包详情', icon: 'table' }
      },
      {
        path: 'detail/create',
        name: 'CreatePackageProblem',
        hidden: true,
        component: () => import('@/views/problem/create'),
        meta: { title: '添加题目', icon: 'edit' }
      },
      {
        path: 'detail/update/:id',
        name: 'UpdatePackageProblem',
        hidden: true,
        component: () => import('@/views/problem/update'),
        meta: { title: '更新题目', icon: 'edit' }
      },
      {
        path: 'index',
        name: 'AllPackage',
        component: () => import('@/views/package/index'),
        meta: { title: '所有题包', icon: 'table' }
      },
      {
        path: 'create',
        name: 'CreatePackage',
        component: () => import('@/views/package/create'),
        meta: { title: '添加题包', icon: 'edit' }
      },
      {
        path: 'update/:id',
        name: 'UpdatePackage',
        hidden: true,
        component: () => import('@/views/package/update'),
        meta: { title: '更新题包', icon: 'edit' }
      }
    ]
  },

  {
    path: '/problem',
    component: Layout,
    redirect: '/problem/index',
    name: 'Problem',
    meta: { title: '题目管理', icon: 'problem' },
    children: [
      {
        path: 'index',
        name: 'AllProblem',
        component: () => import('@/views/problem/index'),
        meta: { title: '所有题目', icon: 'problem' }
      },
      {
        path: 'create',
        name: 'CreateProblem',
        component: () => import('@/views/problem/create'),
        meta: { title: '添加题目', icon: 'edit' }
      },
      {
        path: 'update/:id',
        name: 'UpdateProblem',
        hidden: true,
        component: () => import('@/views/problem/update'),
        meta: { title: '更新题目', icon: 'edit' }
      }
    ]
  },

  {
    path: '/lesson',
    component: Layout,
    redirect: '/lesson/index',
    name: 'Lesson',
    meta: { title: '课程管理', icon: 'lesson' },
    children: [
      {
        path: 'index',
        name: 'AllLessonm',
        component: () => import('@/views/lesson/index'),
        meta: { title: '所有课程', icon: 'lesson' }
      },
      {
        path: 'create',
        name: 'CreateLesson',
        component: () => import('@/views/lesson/createLesson'),
        meta: { title: '添加课程', icon: 'edit' }
      },
      {
        path: 'update/:id',
        name: 'UpdateLesson',
        hidden: true,
        component: () => import('@/views/lesson/updateLesson'),
        meta: { title: '更新课程', icon: 'edit' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

