export const TOKEN = "ai-text-helper-token";
import { emitter } from "@/main.js";
export const  DEFAULTERROR = "something wrong";
export const _get = async (url = "", auth = "") => {
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
export const _post = async (url = "", data = {} ,auth = "") => {
  try {
    const resStr = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "authentication": auth,
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