import { UPDATEFILE, CREATEFILE,ACQUIREFILE} from "@/fetch/api.js";
import { emitter } from "@/main.js";
import { TOKEN, DEFAULTERROR, _get, _post } from "@/fetch/fetch.js";
import { exceptionStateMap } from "@/util/constantData.js";
import { useExceptionStore } from "@/store/exceptionState.js";

export const updateFile = async (data = {}) => {
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    emitter.emit("login-error", "登录信息出错，请重新登录！");
  }
  const res = await _post(UPDATEFILE, data, auth);
  if (res?.code !== 200) {
    emitter.emit("save-in-cloud-error", res?.msg || DEFAULTERROR);
    return;
  }
  emitter.emit("save-in-cloud-success", "文件云端更新成功!");
};
export const createFile = async (data = {}) => {
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    emitter.emit("login-error", "登录信息出错，请重新登录！");
  }
  const res = await _post(CREATEFILE, data, auth);
  if (res?.code !== 200) {
    emitter.emit("save-in-cloud-error", res?.msg || DEFAULTERROR);
    return;
  }
  emitter.emit("save-in-cloud-success", "文件云端更新成功!");
};
export const acquireFile = async (data = {}) => {
  const exceptionState = useExceptionStore();
  const auth = window.localStorage.getItem(TOKEN);
  if (!auth) {
    emitter.emit("login-error", "登录信息出错，请重新登录！");
    exceptionState.updateExceptionState(exceptionStateMap.NOTLOGIN)
    return
  }
  const res = await _post(ACQUIREFILE, data, auth);
  if (res?.code !== 200) {
    emitter.emit("save-in-cloud-error", res?.msg || DEFAULTERROR);
    exceptionState.updateExceptionState(exceptionStateMap.ERROR)
    exceptionState.updateexceptionDescription(res?.msg || DEFAULTERROR)
    return
  }
  emitter.emit("save-in-cloud-success", "文件获取成功!");
  exceptionState.updateExceptionState(exceptionStateMap.SUCCESS)
  return res?.data;
};
