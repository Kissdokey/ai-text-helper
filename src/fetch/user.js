import { REGISTER, LOGIN, AUTHENTICATION } from "@/fetch/api.js";
import { emitter } from "@/main.js";

const TOKEN = "ai-text-helper-token";
const DEFAULTERROR = "something wrong";
const _get = async (url = "", auth = "") => {
  try {
    const resStr = await fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        authentication: auth,
      },
    });
    const res = await resStr.json();
    return res;
  } catch (error) {
    emitter.emit("network-error", error);
  }
};
const _post = async (url = "", data = {}) => {
  try {
    const resStr = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await resStr.json();
    return res;
  } catch (error) {
    emitter.emit("network-error", error);
  }
};
//目前不限制注册次数，后续可拓展手机号验证码绑定手机号进行限制
export const register = async (data = {}) => {
  const res = await _post(REGISTER, data);
  if (res?.code === 200) {
    emitter.emit('register-success',res?.msg || DEFAULTERROR)
    return true;
  }
  emitter.emit("register-error", res?.msg || DEFAULTERROR);
  return false;
};
//登录功能返回jwt-token就存储在本地localstorage中，每次请求带上这个token，如果后端返回过期，清除本地缓存跳转登录界面重新获取
export const login = async (data = {}, callback) => {
  const res = await _post(LOGIN, data, "login-error");
  if (res?.code === 200 && res?.data?.jwt) {
    window.localStorage.setItem(TOKEN, res.data.jwt);
    emitter.emit("login-success", res?.msg || DEFAULTERROR);
    callback(res);
    return true;
  } else {
    emitter.emit("login-error", res?.msg || DEFAULTERROR);
    return false;
  }
};
export const authentication = async (callback) => {
  //无感登录，刷新或者首次进入，获取token，请求判断是否过期，不过期直接让后端返回用户信息
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    callback({});
    return;
  }
  const res = await _get(AUTHENTICATION, auth);
  if (res?.code !== 200) {
    emitter.emit("login-error", res?.msg || DEFAULTERROR);
    callback({});
    return;
  }
  emitter.emit('login-success','登陆成功!')
  callback(res);
};
