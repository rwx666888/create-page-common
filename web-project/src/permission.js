import router, { selfaddRoutes } from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({
  showSpinner: false
}) // NProgress Configuration

// const whiteList = [] // no redirect whitelist

;(async function () {
  const accessRoutes = await store.dispatch('permission/generateRoutes')
  console.log('ggg', accessRoutes)
  selfaddRoutes(accessRoutes)
})()

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
