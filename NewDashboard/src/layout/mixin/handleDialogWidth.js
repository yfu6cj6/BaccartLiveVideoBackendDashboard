import { mapGetters } from 'vuex'

export default {
  props: {
    'pcWidth': {
      type: String,
      require: true,
      default() {
        return '20%'
      }
    },
    'mobileWidth': {
      type: String,
      require: true,
      default() {
        return '40%'
      }
    }
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'device'
    ]),
    formWidth() {
      return this.device === 'mobile' ? this.mobileWidth : this.pcWidth
    }
  },
  methods: {
  }
}
