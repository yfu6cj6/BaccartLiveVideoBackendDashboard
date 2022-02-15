export function transTableDataByLang(data) {
  // 幣種
  if (data.Currency) {
    if (data.Currency === 156) {
      data.CurrencyLabel = 'CNY'
    } else if (data.Currency === 840) {
      data.CurrencyLabel = 'USD'
    } else if (data.Currency === 901) {
      data.CurrencyLabel = 'TWD'
    } else if (data.Currency === 978) {
      data.CurrencyLabel = 'EUR'
    }
  }

  // 帳號狀態
  if (data.Status) {
    if (data.Status === 1) {
      data.StatusKey = '__enable'
    }
    if (data.Status === 2) {
      data.StatusKey = '__close'
    }
  }

  // 訂單狀態
  if (data.OrderStatus) {
    if (data.OrderStatus === 1) {
      data.OrderStatusKey = '__paid'
    }
    if (data.OrderStatus === 2) {
      data.OrderStatusKey = '__noPayout'
    }
  }

  // 遊戲玩法
  if (data.GamePlay !== null) {
    if (data.GamePlay === 0) {
      data.GamePlayKey = '__banker'
    }
    if (data.GamePlay === 1) {
      data.GamePlayKey = '__player'
    }
    if (data.GamePlay === 2) {
      data.GamePlayKey = '__tie'
    }
    if (data.GamePlay === 3) {
      data.GamePlayKey = '__bankerPair'
    }
    if (data.GamePlay === 4) {
      data.GamePlayKey = '__playerPair'
    }
    if (data.GamePlay === 5) {
      data.GamePlayKey = '__banker_commissionFree'
    }
    if (data.GamePlay === 6) {
      data.GamePlayKey = '__superSix'
    }
    if (data.GamePlay === 7) {
      data.GamePlayKey = '__bankerDragon'
    }
    if (data.GamePlay === 8) {
      data.GamePlayKey = '__playerDragon'
    }
    if (data.GamePlay === 9) {
      data.GamePlayKey = '__anyPair'
    }
    if (data.GamePlay === 10) {
      data.GamePlayKey = '__perfectPair'
    }
    if (data.GamePlay === 11) {
      data.GamePlayKey = '__bankerSample'
    }
    if (data.GamePlay === 12) {
      data.GamePlayKey = '__playerample'
    }
    if (data.GamePlay === 13) {
      data.GamePlayKey = '__big'
    }
    if (data.GamePlay === 14) {
      data.GamePlayKey = '__small'
    }
    if (data.GamePlay === 15) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 16) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 17) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 18) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 19) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 20) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 21) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 22) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 23) {
      data.GamePlayKey = '__superTie'
    }
    if (data.GamePlay === 24) {
      data.GamePlayKey = '__superTie'
    }
  }

  if (data.RegisterTime) {
    data.RegisterTime = data.RegisterTime.replace('T', ' ')
  }
  return data
}
