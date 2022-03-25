export default {
  data() {
    return {
      viewHeight: 0,
      otherHeight: 100,
      formClassName: []
    }
  },
  mounted() {
    this.formClassName.push('el-pagination')
    this.formClassName.push('seachForm')
    window.onresize = () => {
      this.setHeight()
    }
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  methods: {
    setHeight() {
      const windowsHeight = document.body.clientHeight
      let formHeight = 0
      this.formClassName.forEach(element => {
        const el = document.getElementsByClassName(element)[0]
        if (el) {
          console.log('??!!' + element + ' : ' + el.clientHeight)
          formHeight += el.clientHeight
        }
      })
      this.viewHeight = windowsHeight - this.otherHeight - formHeight
      console.log('!!this.windowsHeight: ' + windowsHeight)
      console.log('!!this.otherHeight: ' + this.otherHeight)
      console.log('!!this.formHeight: ' + formHeight)
      console.log('!!this.viewHeight: ' + this.viewHeight)
    }
  }
}
