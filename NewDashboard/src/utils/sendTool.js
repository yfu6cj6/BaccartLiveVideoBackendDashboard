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
      const callBackIndex = element.callBacks.indexOf(func)
      if (callBackIndex >= 0) {
        element.callBacks.splice(callBackIndex, 1)
        if (element.callBacks.length === 0) {
          const containerIndex = sendContainer.indexOf(element)
          sendContainer.splice(containerIndex, 1)
        }
        return
      }
    }
  })
}
