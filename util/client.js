'use strict'

const AipContentCensorClient = require("baidu-aip-sdk").contentCensor;

// 设置APPID/AK/SK
const APP_ID = "15885234";
const API_KEY = "aRL5O3mWZTG89KnUhI8ktHpA";
const SECRET_KEY = "8bklmVLVcZiwdWACPWm3FsBf8msSRVmR";

// 新建一个对象，建议只保存一个对象调用服务接口
const client = new AipContentCensorClient(APP_ID, API_KEY, SECRET_KEY);

module.exports = client;