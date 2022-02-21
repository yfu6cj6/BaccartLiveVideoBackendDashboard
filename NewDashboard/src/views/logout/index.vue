<script>
export default {
  created() {
    this.$store.dispatch('user/logout').then(() => {
      this.$router.push({ path: '/home' })
      this.$message({
        message: this.$t('__logout') + this.$t('__success'),
        type: 'success'
      })
    }).catch(() => {
      this.$message({
        message: this.$t('__logout') + this.$t('__fail'),
        type: 'error'
      })
    })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
