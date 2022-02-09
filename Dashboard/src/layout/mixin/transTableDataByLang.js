import { getLanguage } from '@/lang/lang'
// 因為後端回傳的值為ID，所以在這邊做資料還有語言的轉換
export default {
  methods: {
    transTableDataByLang(item) {
    // 幣種
      if (item.Currency !== null) {
        if (item.Currency === 156) {
          item.Currency = 'CNY'
        } else if (item.Currency === 840) {
          item.Currency = 'USD'
        } else if (item.Currency === 901) {
          item.Currency = 'TWD'
        } else if (item.Currency === 978) {
          item.Currency = 'EUR'
        }
      }
      if (item.Device != null) {
        if (item.Device === 1) {
          item.Device = 'Mobile'
        }
        if (item.Device === 2) {
          item.Device = 'PC'
        }
      }
      // 遊戲玩法
      if (item.GamePlay !== null) {
        if (item.GamePlay === 0) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '莊家' : '庄家'
        }
        if (item.GamePlay === 1) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '閒家' : '闲家'
        }
        if (item.GamePlay === 2) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '和' : '和'
        }
        if (item.GamePlay === 3) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '莊對' : '庄对'
        }
        if (item.GamePlay === 4) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '閒對' : '闲对'
        }
        if (item.GamePlay === 5) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '莊家(免傭金)' : '庄家(免佣金)'
        }
        if (item.GamePlay === 6) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超級六' : '超级六'
        }
        if (item.GamePlay === 7) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '莊龍寶' : '庄龙宝'
        }
        if (item.GamePlay === 8) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '閒龍寶' : '闲龙宝'
        }
        if (item.GamePlay === 9) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '任意對子' : '任意对子'
        }
        if (item.GamePlay === 10) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '完美對子' : '完美对子'
        }
        if (item.GamePlay === 11) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '莊例牌' : '庄例牌'
        }
        if (item.GamePlay === 12) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '閒例牌' : '闲例牌'
        }
        if (item.GamePlay === 13) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '大' : '大'
        }
        if (item.GamePlay === 14) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '小' : '小'
        }
        if (item.GamePlay === 15) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和0' : '超和0'
        }
        if (item.GamePlay === 16) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和1' : '超和1'
        }
        if (item.GamePlay === 17) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和2' : '超和2'
        }
        if (item.GamePlay === 18) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和3' : '超和3'
        }
        if (item.GamePlay === 19) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和4' : '超和4'
        }
        if (item.GamePlay === 20) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和5' : '超和5'
        }
        if (item.GamePlay === 21) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和6' : '超和6'
        }
        if (item.GamePlay === 22) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和7' : '超和7'
        }
        if (item.GamePlay === 23) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和8' : '超和8'
        }
        if (item.GamePlay === 24) {
          item.GamePlay = getLanguage() === 'zh_cht' ? '超和9' : '超和9'
        }
      }
      // 訂單狀態
      if (item.OrderStatus !== null) {
        if (item.OrderStatus === 1) {
          item.OrderStatus = '已派彩'
        } else if (item.OrderStatus === 2) {
          item.OrderStatus = '未派彩'
        }
      }
      // 帳號狀態
      if (item.Status !== null) {
        if (item.Status === 1) {
          // item.Status = getLanguage() === 'zh_cht' ? '啟用' : '启用'
          item.Status = this.$t('__enable')
        }
        if (item.Status === 2) {
          item.Status = getLanguage() === 'zh_cht' ? '關閉' : '关闭'
        }
      }
      if (item.TransactionType !== null) {
        if (item.TransactionType === 0) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '全部' : '全部'
        }
        if (item.TransactionType === 1) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '下注' : '下注'
        }
        if (item.TransactionType === 2) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '結算' : '结算'
        }
        if (item.TransactionType === 3) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '轉入額度' : '转入额度'
        }
        if (item.TransactionType === 4) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '轉出額度' : '转出额度'
        }
        if (item.TransactionType === 5) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '重新派彩' : '重新派彩'
        }
        if (item.TransactionType === 6) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '取消下注' : '取消下注'
        }
        if (item.TransactionType === 7) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '小費' : '小费'
        }
        if (item.TransactionType === 8) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '重算失敗' : '重算失败'
        }
        if (item.TransactionType === 9) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '添加代理' : '添加代理'
        }
        if (item.TransactionType === 10) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '代理增減錯誤' : '代理增减错误'
        }
        if (item.TransactionType === 11) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '紅包' : '红包'
        }
        if (item.TransactionType === 12) {
          item.TransactionType = getLanguage() === 'zh_cht' ? '退款' : '退款'
        }
      }
      return item
    }
  }
}
