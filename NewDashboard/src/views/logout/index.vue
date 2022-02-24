<script>
export default {
  created() {
    this.$store.dispatch('user/logout').then(() => {
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
