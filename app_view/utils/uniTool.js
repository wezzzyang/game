class UniTool {
  showToast(message, time = 1500) {
    uni.showToast({
      title: message,
      duration: time,
      icon: "none",
    });
  }

  showModal(
    message,
    func = () => {
      this.showToast("操作已执行");
    },
    cancel = () => {
      this.showToast("操作已取消");
    }
  ) {
    uni.showModal({
      title: "",
      content: message,
      success: async function (res) {
        if (res.confirm) {
          func();
        } else if (res.cancel) {
          cancel();
        }
      },
    });
  }
  setStorage(key, data) {
    return uni.setStorageSync(key, data);
  }
  getStorage(key) {
    return uni.getStorageSync(key);
  }
  removeStorage(key) {
    return uni.removeStorageSync(key);
  }
  navTo(url) {
    uni.navigateTo({
      url: `/pages${url}`,
      animationType: "pop-in",
      animationDuration: 200,
    });
  }
  redirectTo(url) {
    uni.redirectTo({
      url: `/pages${url}`,
      animationType: "pop-in",
      animationDuration: 200,
    });
  }
  navBack(num) {
    uni.navigateBack({
      delta: num,
      animationType: "pop-out",
      animationDuration: 200,
    });
  }
}

export default new UniTool();
