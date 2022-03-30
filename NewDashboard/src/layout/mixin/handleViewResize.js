export default {
  data() {
    return {
      viewHeight: 0,
      otherHeight: 0,
      formClassName: []
    }
  },
  computed: {
    commonClassName() {
      return ['navbar', 'tags-view-container', 'seachForm', 'el-pagination']
    },
    commonOtherHeight() {
      return 5
    }
  },
  mounted() {
    window.onresize = () => {
      this.setHeight()
    }
    this.$nextTick(() => {
      this.setHeight()
    })
  },
  methods: {
    setHeight() {
      const windowsHeight = document.body.offsetHeight
      let formHeight = 0
      const className = this.commonClassName.concat(this.formClassName)
      className.forEach(element => {
        const el = document.getElementsByClassName(element)[0]
        if (el) {
          formHeight += el.offsetHeight
        }
      })
      this.viewHeight = windowsHeight - this.otherHeight - this.commonOtherHeight - formHeight
    }
  }
}
