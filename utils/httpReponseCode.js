const responseCode = {
  404: {
    default: '资源不存在，请刷新后再试',
    E404: '资源不存在'
  },
  400: {
    default: '请求参数不正确'
  },
  401: {
    default: '需要登录或登录失败',
    E401_100002: '需要登录后才能操作',
    E401_100003: '需要重新登录,您已在其它设备登录'
  },
  403: {
    default: '禁止访问你没有权限',
    E403_100002: '操作太频繁，请稍后再试',
    E403_100003: '禁止删除，存在数据关联'
  },
  405: {
    default: '不支持的请求方法',
    E405_100001: '不支持的请求方法'
  },
  409: {
    default: '数据资源冲突'
  },
  500: {
    default: '抱歉系统好像出问题了'
  }
}

/**
 * 根据code获取对应信息
 * @param code
 * @returns {*}
 */
export function getMsgSimple (code) {
  let matched = null
  if (responseCode[code]) {
    matched = responseCode[code].default
    return matched
  } else {
    for (let item in responseCode) {
      if (responseCode[item][code]) {
        matched = responseCode[item][code]
        return matched
      }
    }
  }

  return matched
}
export function getMsg (status, code) {
  let msg = getMsgSimple(code)
  if (msg) {
  } else {
    msg = getMsgSimple(status)
  }
  return msg
}
export default responseCode
