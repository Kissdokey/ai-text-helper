export const imageToBase64 = async (image) => {
  return new Promise((res, rej) => {
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = function () {
      let imgData = this.result; //base64数据
      res(imgData);
    };
    reader.onerror = (err)=> {
        rej(err)
    }
  });
};
