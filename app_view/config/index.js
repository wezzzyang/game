let baseUrl = "http://10.1.1.178:889/api";
let socketUrl = "http://10.1.1.178:889/test";
let gSocketUrl = "http://127.0.0.1:7001/game"
baseUrl = "http://127.0.0.1:7001/api";
socketUrl = "http://127.0.0.1:7001/test";

//#ifdef APP-PLUS
baseUrl = "http://10.1.111.5:7001/api";
socketUrl = "http://10.1.111.5:7001/test";
//#endif

//#ifdef H5
// baseUrl = "http://127.0.0.1:7001/api";
//#endif

export default {
  baseUrl,
  gSocketUrl
};