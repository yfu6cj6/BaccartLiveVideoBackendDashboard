<script>
import { logout } from '@/api/user'

export default {
  created() {
    logout().then(() => {
      this.$store.dispatch('user/logout')
      this.$message({
        message: 'Logout successfully',
        type: 'success'
      })
      this.$router.push({ path: '/login' })
    }).catch(() => {
      this.$message({
        message: 'Logout failed',
        type: 'error'
      })
    })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
