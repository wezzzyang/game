<template>
  <div class="game">
    <div class="game-list">
      <div class="game-item" v-for="(item, index) in list" :key="index">
        <div class="palyer-1" @click="navTo(index)">
          {{ item[0] === null ? "空" : "人" }}
        </div>
        <div class="room">房间{{ index + 1 }}</div>
        <div class="palyer-2" @click="navTo(index)">
          {{ item[1] === null ? "空" : "人" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    socket: null,
    list: [],
  }),
  computed: {},
  methods: {
    navTo(index) {
      uni.navigateTo({
        url: `/pages/game/room?room=${index}`,
      });
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  async onLoad() {
    for (let i = 0; i < 10; i++) {
      this.list[i] = [null, null];
    }
    this.socket = await this.$gSocket;
    this.socket.on("inRoom", (list) => {
      this.list = list;
    });
    setTimeout((x) => {
      this.socket.emit("inRoom");
    }, 100);
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页a面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {
    this.socket.removeListener("inRoom");
  },
  // 页面处理函数--监听用户下拉动作
  onPullDownRefresh() {
    uni.stopPullDownRefresh();
  },
  // 页面处理函数--监听用户上拉触底
  onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  /* onPageScroll(event) {}, */
  // 页面处理函数--用户点击右上角分享
  /* onShareAppMessage(options) {}, */
};
</script>

<style lang="scss" scoped>
.game {
  .game-list {
    padding: 0 20rpx;
    display: flex;
    flex-wrap: wrap;
    .game-item {
      display: flex;
      align-items: center;
      margin: 20rpx 10rpx;
      .palyer-1 {
        height: 80rpx;
        width: 80rpx;
        border: 1px solid #d3d3d3;
        text-align: center;
        line-height: 80rpx;
        background: #e27328;
        color: white;
      }
      .room {
        height: 120rpx;
        width: 120rpx;
        border: 1px solid #d3d3d3;
        margin: 0 20rpx;
        text-align: center;
        line-height: 120rpx;
        background: #ecc849;
        color: white;
      }
      .palyer-2 {
        @extend .palyer-1;
      }
    }
  }
}
</style>
