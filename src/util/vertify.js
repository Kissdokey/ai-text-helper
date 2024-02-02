const STRONGEXP = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*,\._])[0-9a-zA-Z!@#$%^&*,\\._]{8,12}$/

export const NOTEMSG = '密码必须包含大小写字母,特殊字符和数字，且长度不低于8位。'

export const isStrongEnough = (str)=> {
 return STRONGEXP.test(str)
}