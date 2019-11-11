function isThisType(val) {
  for (let key in this) {
    if (this[key] === val) {
      return true
    }
  }
  return false
}
const LoginType = {
  USER_MINI_PROGRAM: 100,
  USER_EMAIL: 101,
  USER_MOBILE: 102,
  ADMIN_EMAIL: 200,
  isThisType
}
const ApiType = {
  USER: 1,
  ADMIN: 10,
  SUPER_ADMIN: 20
}
module.exports = {
  LoginType,
  ApiType
}