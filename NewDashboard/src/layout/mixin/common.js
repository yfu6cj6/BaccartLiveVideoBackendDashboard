export default {
  methods: {
    confirmMsg(msg, callBack) {
      this.$confirm(msg, {
        closeOnClickModal: false,
        closeOnPressEscape: false,
        confirmButtonClass: 'bg-yellow',
        cancelButtonClass: 'bg-gray'
      }).then(_ => {
        callBack()
      }).catch(() => {
      })
    }
  }
}
