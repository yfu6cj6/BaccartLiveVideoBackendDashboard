export default {
  data() {
    const windowsHeight = document.body.clientHeight
    const windowsWidth = document.body.clientWidth
    return {
      viewHeight: windowsHeight,
      viewWidth: windowsWidth
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
