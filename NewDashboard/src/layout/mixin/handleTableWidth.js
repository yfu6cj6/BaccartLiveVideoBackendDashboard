export default {
  data() {
    return {
    }
  },
  methods: {
    calculateWidth(defaultText, key, charWidth) {
      let width = defaultText.length * 24.5
      this.tableData.forEach(element => {
        const str = element[key].toString()
        const fontWidth = str.length * charWidth
        if (width < fontWidth) {
          width = fontWidth
        }
      })
      return width
    }
  }
}
