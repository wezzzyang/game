<script>
export default {
  onLaunch: async function () {},
  onShow: function () {},
  onHide: function () {},
};
</script>

<style lang="scss">
.u-mask-zoom {
  display: none;
}
/*每个页面公共css */
.uni-scroll-view-content {
  background: #88888814;
}
html,
body {
  height: 100%;
  font-size: 28rpx;
  background: #f8f8f8;
}
.u-border-bottom {
  border-bottom: 2rpx solid #e8e8e8;
  margin-bottom: 50rpx;
  padding: 10rpx 0;
}
.u-form-item__message {
  position: absolute;
  bottom: -20px;
}
.yxl-btn {
  font-size: 28rpx;
  background: #42b983;
  color: white;
  box-shadow: 1px 1px 3px #bbb;
  &:active {
    transform: translate(2px, 2px);
  }
}
.u-toast.u-position-top {
  top: 15% !important;
}
</style>
