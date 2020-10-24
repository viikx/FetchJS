import Core from './core.js'

/**
 * Fetch(url,{})
 * Fetch(url,{body})
 */


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
Fetch.setOption = (props: RequestInit) => {
  Core.getInstance().setOption(props)
}
export default Fetch