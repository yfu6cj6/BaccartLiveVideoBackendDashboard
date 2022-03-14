const sendContainer = []

export function sendData(sendKey, parameter) {
  sendContainer.forEach(element => {
    if (element.key === sendKey) {
      element.callBacks.forEach(callBack => {
        callBack(parameter)
      })
      return
    }
  })
}

export function register(registerKey, func) {
  sendContainer.forEach(element => {
    if (element.key === registerKey) {
      element.callBacks.push(func)
      return
    }
  })
  sendContainer.push({ key: registerKey, callBacks: [func] })
}

export function unRegister(registerKey, func) {
  sendContainer.forEach(element => {
    if (element.key === registerKey) {
      const index = element.callBacks.indexOf(func)
      if (index >= 0) {
        element.callBacks.slice(index, 1)
        return
      }
    }
  })
}
