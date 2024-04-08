export const deepCopy = (source) => {
    if (typeof source != "object" || source == null) {
      return source;
    }
    var newObj = source.constructor === Array ? [] : {}; //开辟一块新的内存空间
    for (let i in source) {
      newObj[i] = deepCopy(source[i]);
    }
    return newObj;
  };