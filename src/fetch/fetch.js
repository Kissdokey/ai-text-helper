export const TOKEN = "ai-text-helper-token";
import { emitter } from "@/main.js";
export const DEFAULTERROR = "something wrong";
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
export const _post = async (url = "", data = {}, auth = "") => {
  try {
    const resStr = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        authentication: auth,
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
export const stream_post = async (url = "", data = {}, auth = "", cb) => {
  try {
    const resStr = await fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        authentication: auth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const reader = resStr.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        cb({ done, value });
        break;
      }
      const text = decoder.decode(value);
      let textArray = text.split("\n");
      textArray = textArray.filter((item) => item.length > 0);
      if (textArray.length > 1) {
        textArray.forEach((item) => {
          const textObj = JSON.parse(item.replace(/(\b\w+\b)(?=:)/g, '"$1"'));
          if (textObj?.error_msg || textObj?.code) {
            emitter.emit("response-error", textObj?.error_msg || textObj?.msg);
            cb({ done: true, value: textObj });
          } else {
            cb({ done, value: textObj });
          }
        });
      } else {
        // 打印第一块的文本内容
        const textObj = JSON.parse(text.replace(/(\b\w+\b)(?=:)/g, '"$1"'));
        if (textObj?.error_msg || textObj?.code) {
          emitter.emit("response-error", textObj?.error_msg || textObj?.msg);
          cb({ done: true, value: textObj });
        } else {
          cb({ done, value: textObj });
        }
      }
    }
  } catch (error) {
    emitter.emit("network-error", error);
    console.log(error);
  }
};
