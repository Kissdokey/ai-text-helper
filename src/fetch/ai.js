import { TEXTDEAL, AIREQUEST } from "@/fetch/api.js";
import { emitter } from "@/main.js";
import { TOKEN, DEFAULTERROR, _get, _post } from "@/fetch/fetch.js";
export const textDeal = async (data = {}, callback) => {
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    callback({});
    emitter.emit("login-error", "登录信息出错，请重新登录！");
  }
  const res = await _post(TEXTDEAL, data, auth);
  if (res?.code !== 200) {
    emitter.emit("ai-request-error", res?.msg || DEFAULTERROR);
    return;
  }
  emitter.emit("ai-request-success", "ai请求成功!");
  console.log(res);
  callback(res);
};

export const aiRequest = async (data = {}, callback) => {
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    callback({});
    emitter.emit("login-error", "登录信息出错，请重新登录！");
  }
  const res = await _post(AIREQUEST, data, auth);
  if (res?.code !== 200) {
    emitter.emit("ai-request-error", res?.msg || DEFAULTERROR);
    return;
  }
  emitter.emit("ai-request-success", "ai请求成功!");
  console.log(res);
  callback(res);
};
