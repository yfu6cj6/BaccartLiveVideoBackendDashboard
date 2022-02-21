/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLoginAccount(str) {
  return true
}

/**
 * @param {String} str
 * @returns {Number}
 */
export function validAccount(str) {
  if (str) {
    const upper = str.match(/^.*[A-Z]+.*$/)
    const lower = str.match(/^.*[a-z]+.*$/)
    const number = str.match(/^.*[0-9]+.*$/)
    if (!upper) return 1
    if (!lower) return 2
    if (!number) return 3
  }
}
