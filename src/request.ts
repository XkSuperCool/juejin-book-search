const BASE_URL = 'https://api.juejin.cn'

export function request(url: string, options?: RequestInit) {
  return fetch(
    `${BASE_URL}${url}`,
    Object.assign(
      {
        headers: {
          'content-type': 'application/json'
        },
        /**
         * 跨域请求是否发送 cookie
         *  omit(默认值): 不发送 cookie
         *  include: 总是发送 cookie
         */
        credentials: 'include'
      },
      options
    )
  ).then(res => res.json())
}
