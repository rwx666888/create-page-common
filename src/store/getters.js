const getters = {
  sidebar: state => state.app.sidebar,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  menuTree: state => {
    return state.user.permissionTree.filter(i => i.type === 1).map(i => {
      return {
        code: i.code,
        sort: i.sort,
        name: i.name
      }
    })
  }, // 菜单权限
  sourceTree: state => {
    return state.user.permissionTree.filter(i => i.type === 3).map(i => i.code)
  }, // 资源权限
  avatar: state => (state.user.userInfo && state.user.userInfo.portraitUrl) || '',
  name: state => state.user.name,
  userInfo: state => state.user.userInfo,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes
}
export default getters
