import {
  REGISTER,
  LOGIN,
  AUTHENTICATION,
  UPDATEAVATAR,
  UPDATEDIRECTORYDEPENDENCE,
  UPDATEUSERFILE,
} from "@/fetch/api.js";
import { emitter } from "@/main.js";
import { TOKEN, DEFAULTERROR, _get, _post } from "@/fetch/fetch.js";

//目前不限制注册次数，后续可拓展手机号验证码绑定手机号进行限制
export const register = async (data = {}) => {
  const res = await _post(REGISTER, data);
  if (res?.code === 200) {
    emitter.emit("register-success", res?.msg || DEFAULTERROR);
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
  emitter.emit("login-success", "登陆成功!");
  callback(res);
};

export const updateDirectoryDependence = async (data = {}) => {
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    emitter.emit("login-error", "登录信息出错，请重新登录！");
  }
  const res = await _post(UPDATEDIRECTORYDEPENDENCE, data, auth);
  if (res?.code !== 200) {
    emitter.emit("update-directoryDependence-error", res?.msg || DEFAULTERROR);
    return;
  }
  emitter.emit("update-directoryDependence-success", "更新目录成功!");
};
export const updateUserFile = async (data = {}) => {
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    emitter.emit("login-error", "登录信息出错，请重新登录！");
  }
  const res = await _post(UPDATEUSERFILE, data, auth);
  if (res?.code !== 200) {
    emitter.emit("update-userFile-error", res?.msg || DEFAULTERROR);
    return;
  }
  emitter.emit("update-userFile-success", "用户文件记录添加成功!");
};

export const updateUserAvatar = async (data = {}, callback) => {
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    callback({});
    emitter.emit("login-error", "登录信息出错，请重新登录！");
  }
  const res = await _post(UPDATEAVATAR, data, auth);
  if (res?.code !== 200) {
    emitter.emit("update-avatar-error", res?.msg || DEFAULTERROR);
    return;
  }
  emitter.emit("update-avatar-success", "更换头像成功!");
  callback(res?.data?.avatar);
};