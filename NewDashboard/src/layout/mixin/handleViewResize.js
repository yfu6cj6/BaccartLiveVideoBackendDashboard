export default {
  data() {
    return {
      viewHeight: '',
      viewWidth: ''
    }
  },
  mounted() {
    window.onresize = () => {
      return (() => {
        this.setHeight()
      })()
    }
  },
  methods: {
    setHeight() {
      const windowsHeight = document.body.clientHeight
      this.viewHeight = windowsHeight - 220
    },
    setWidth() {
      const windowsWidth = document.body.clientWidth
      this.viewWidth = windowsWidth
    }
  }
}
