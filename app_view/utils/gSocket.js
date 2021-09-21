import io from "@hyoga/uni-socket.io";
import config from "../config/index.js";

class Socket {
  constructor() {}
  async connect() {
    return new Promise((resolve) => {
      const socket = io(config.gSocketUrl);

      socket.on("connect", () => {
        resolve(socket);
      });

      socket.on("error", (msg) => {
        console.log("ws error", msg);
      });
    });
  }
}

export default new Socket().connect();