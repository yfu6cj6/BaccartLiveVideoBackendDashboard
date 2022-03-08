import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      mobileWidth: '40%',
      pcWidth: '20%'
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ]),
    pc_Width: {
      get() {
        return this.pcWidth
      },
      set(val) {
        this.pcWidth = val
      }
    },
    mobile_Width: {
      get() {
        return this.mobileWidth
      },
      set(val) {
        this.mobileWidth = val
      }
    },
    formWidth() {
      return this.device === 'mobile' ? this.mobile_Width : this.pc_Width
    }
  },
  methods: {
  }
}
