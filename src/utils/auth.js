import Cookies from 'js-cookie'

const TokenKey = process.env.VUE_APP_TOKEN_KEY
const RefreshTokenKey = process.env.VUE_APP_REFRESH_TOKEN_KEY
const domain = process.env.NODE_ENV === 'production' ? document.domain.split('.').slice(-2).join('.') : ''

console.log(domain, 'domain')
// const TokenKey = 'Admin-Token'
// const RefreshTokenKey = 'Admin-Refresh-Token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token, { path: '/', domain })
}

export function removeToken () {
  return Cookies.remove(TokenKey, { path: '/', domain })
}

export function getRefreshToken () {
  return Cookies.get(RefreshTokenKey)
}

export function setRefreshToken (refreshToken) {
  return Cookies.set(RefreshTokenKey, refreshToken, { path: '/', domain })
}

export function removeRefreshToken () {
  return Cookies.remove(RefreshTokenKey, { path: '/', domain })
}
