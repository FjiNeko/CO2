<script>
export default {
  onLaunch: function () {
    const token = uni.getStorageSync('token')
    const role = uni.getStorageSync('role')
    if (token) {
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style>
/* 每个页面公共 css */
</style>
