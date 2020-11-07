import Core, { customRequestInit } from './core'

/**
 * Fetch(url,{})
 * Fetch(url,{body})
 */
if (!fetch) {
  console.error('浏览器不支持fetch')
}
function Fetch(input: string | Function, option?: RequestInit) {
  if (typeof input === 'string') {
    return Core.getInstance().run(input, option)
  }
  else if (typeof input === 'function') {
    return input()
  }
  else {
    throw new Error('请求参数只能是string类型或function类型')
  }
}
// 考虑proxy
Fetch.setOption = (props: customRequestInit) => {
  Core.getInstance().setOption(props)
}
Fetch.interceptors = Core.getInstance().interceptors
export default Fetch