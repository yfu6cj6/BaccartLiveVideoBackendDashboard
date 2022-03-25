<script>
import { logout } from '@/api/user'

export default {
  created() {
    logout().finally(() => {
      window.localStorage.clear()
      window.sessionStorage.clear()
      this.$store.dispatch('user/logout')
      this.$router.push({ path: '/login' })
    })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
