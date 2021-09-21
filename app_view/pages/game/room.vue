<template>
  <div class="room">
    <div v-if="!ifStart">人员不足, 无法开启</div>
    <div class="palyer-1">你是,{{ rule }}</div>
    <div class="palyer-1">{{ downRule }}下</div>
    <div class="container">
      <div class="main">
        <div class="checkerboard">
          <div class="cell-list">
            <div
              class="cell-item"
              v-for="(item, index) in 400"
              :key="index"
            ></div>
          </div>
          <div class="cell-list2">
            <div
              class="cell-item2"
              v-for="(item, index) in checkBoard"
              :key="index"
              @click="downCell(index)"
            >
              <span
                class="ceil"
                v-show="item !== null"
                :style="{
                  background: +item ? '#eee' : '#111',
                }"
              ></span>
            </div>
          </div>
        </div>
      </div>
      <div class="palyer-2"></div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    socket: "",
    checkBoard: [],
    rule: "",
    socketName: null,
    index: null,
    downRule: "黑子",
    room: null,
    whoDown: 0,
    ifStart: false,
  }),
  computed: {},
  methods: {
    leftTop(index) {
      let checkBoard = this.checkBoard;
      let color = this.checkBoard[index];
      let sum = 1;
      let left = 1;
      let right = 1;
      for (let i = 1; i <= 4; i++) {
        if (
          left &&
          checkBoard[index - i * 21 - i] !== undefined &&
          checkBoard[index - i * 21 - i] == color
        ) {
          sum++;
        } else {
          left = 0;
        }
        if (
          right &&
          checkBoard[index + i * 21 + i] !== undefined &&
          checkBoard[index + i * 21 + i] == color
        ) {
          sum++;
        } else {
          right = 0;
        }
      }
      if (sum >= 5) return true;
      return false;
    },
    rightTop(index) {
      let checkBoard = this.checkBoard;
      let color = this.checkBoard[index];
      let sum = 1;
      let left = 1;
      let right = 1;
      for (let i = 1; i <= 4; i++) {
        if (
          left &&
          checkBoard[index - i * 21 + i] !== undefined &&
          checkBoard[index - i * 21 + i] == color
        ) {
          sum++;
        } else {
          left = 0;
        }
        if (
          right &&
          checkBoard[index + i * 21 - i] !== undefined &&
          checkBoard[index + i * 21 - i] == color
        ) {
          sum++;
        } else {
          right = 0;
        }
      }
      if (sum >= 5) return true;
      return false;
    },
    topBottom(index) {
      let checkBoard = this.checkBoard;
      let color = this.checkBoard[index];
      let sum = 1;
      let left = 1;
      let right = 1;
      for (let i = 1; i <= 4; i++) {
        if (
          left &&
          checkBoard[index - i * 21] !== undefined &&
          checkBoard[index - i * 21] == color
        ) {
          sum++;
        } else {
          left = 0;
        }
        if (
          right &&
          checkBoard[index + i * 21] !== undefined &&
          checkBoard[index + i * 21] == color
        ) {
          sum++;
        } else {
          right = 0;
        }
      }
      if (sum >= 5) return true;
      return false;
    },
    leftRight(index) {
      let checkBoard = this.checkBoard;
      let color = this.checkBoard[index];
      let sum = 1;
      let left = 1;
      let right = 1;
      for (let i = 1; i <= 4; i++) {
        if (
          left &&
          checkBoard[index - i] !== undefined &&
          checkBoard[index - i] == color
        ) {
          sum++;
        } else {
          left = 0;
        }
        if (
          right &&
          checkBoard[index + i] !== undefined &&
          checkBoard[index + i] == color
        ) {
          sum++;
        } else {
          right = 0;
        }
      }
      if (sum >= 5) return true;
      return false;
    },
    testWin(index) {
      //左上右下
      if (this.topBottom(index)) return true;
      //左下右上
      if (this.leftTop(index)) return true;
      //上下
      if (this.rightTop(index)) return true;
      //左右
      if (this.leftRight(index)) return true;
    },
    downCell(indexCell) {
      let { checkBoard, rule, index, room, whoDown, ifStart } = this;
      if (!ifStart) return;
      if (whoDown != index) return;
      if (rule === "" || rule === "观众") return;
      if (checkBoard[indexCell] !== null) return;

      this.$set(this.checkBoard, indexCell, index);
      if (this.testWin(indexCell)) {
        this.socket.emit("down", `${index}+${room}`);
        return;
      }

      this.socket.emit("down", {
        room,
        index,
        checkBoard,
      });
    },
    formatRoom() {
      this.downRule = "黑子";
      this.whoDown = 0;
      for (let i = 0; i < 441; i++) {
        this.$set(this.checkBoard, i, null);
      }
    },
  },
  watch: {},

  // 页面周期函数--监听页面加载
  async onLoad({ room }) {
    this.formatRoom();
    this.room = room;
    let socket = await this.$gSocket;
    this.socket = socket;
    let socketName = "room" + room;
    this.socketName = socketName;
    socket.on(socketName, (data) => {
      this.index = data.color;
      if (!data) {
        this.rule = "观众";
        return;
      }
      if (data.color === 0) this.rule = "黑子";

      if (data.color === 1) this.rule = "白子";
    });
    socket.on("down", (data) => {
      if (typeof data == "string") {
        setTimeout(() => {
          alert(data);
          this.formatRoom();
        }, 60);
        return;
      }
      this.whoDown = data.index;
      this.downRule = !this.whoDown ? "黑子" : "白子";
      this.checkBoard = data.checkerBoard;
    });
    socket.on("start", (bool) => {
      this.ifStart = bool;
      if (!bool) {
        this.formatRoom();
        return;
      }
    });
    socket.emit("room", room);
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页a面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  async onUnload() {
    this.socket.removeListener(this.socketName);
    this.socket.removeListener("down");
    this.socket.emit("leave", this.room);
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
$cell: 33rpx;
$table: 658rpx;
.room {
  .container {
    .player-1 {
    }
    .main {
      padding: 20rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .checkerboard {
        position: relative;
        height: 700rpx;
        width: 700rpx;
        background: #d7a232;
        display: flex;
        align-items: center;
        justify-content: center;
        .cell-list {
          height: $table;
          width: $table;
          border: 2px solid black;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          .cell-item {
            height: $cell;
            width: $cell;
            border: 1px solid black;
            box-sizing: border-box;
          }
        }
        .cell-list2 {
          position: absolute;
          height: $table + 32rpx;
          width: $table + 32rpx;
          border: 2px solid black;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          // visibility: hidden;w
          .cell-item2 {
            height: $cell;
            width: $cell;
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            // visibility: visible;
            span {
              // visibility: visible;
              height: 30rpx;
              width: 30rpx;
              border-radius: 50%;
              box-shadow: 0 0 2px 1px #424242;
            }
          }
        }
      }
    }
    .player-2 {
    }
  }
}
</style>
