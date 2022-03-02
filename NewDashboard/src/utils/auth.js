const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

const TokenTypeKey = 'vue_admin_template_tokenType'

export function getTokenType() {
  return localStorage.getItem(TokenTypeKey)
}

export function setTokenType(tokenType) {
  return localStorage.setItem(TokenTypeKey, tokenType)
}

export function removeTokenType() {
  return localStorage.removeItem(TokenTypeKey)
}
