export default {
  props: {
    'formWidthBreakpoint': {
      type: Object,
      require: true,
      default() {
        return {
          'xs': '100%',
          'sm': '70%',
          'md': '50%',
          'lg': '40%',
          'xl': '30%'
        }
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    formWidth() {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return this.formWidthBreakpoint.xs
        case 'sm': return this.formWidthBreakpoint.sm
        case 'md': return this.formWidthBreakpoint.md
        case 'lg': return this.formWidthBreakpoint.lg
        case 'xl': return this.formWidthBreakpoint.xl
        default: return this.formWidthBreakpoint.xl
      }
    }
  }
}
