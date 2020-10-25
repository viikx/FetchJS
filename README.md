# FetchJS

仿造axios 封装fetch

配置通用参数
``` js
Fetch.setOption({
   method: 'GET',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: null,
    credentials: 'same-origin',
    cache: 'default',
    redirect: 'follow',
    referrer: 'client',
    referrerPolicy: 'origin',
    // 封装功能 
    // 超时自动取消
    Timeout: 1000,
    onTimeout:(url)=>{}
})
```

发送请求,配置单次请求参数
``` js
Fetch(url,{
    // fetch原生提供
    method: 'GET',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: null,
    credentials: 'same-origin',
    cache: 'default',
    redirect: 'follow',
    referrer: 'client',
    referrerPolicy: 'origin',
    // 封装功能 
    // 超时自动取消
    Timeout: 1000,
    onTimeout:(url)=>{}
})
```
配置请求前中间件
`Fetch.interceptors.request.use((option)=>{})`  

响应中间件维护中...
<!-- 配置响应中间件
`Fetch.interceptors.response.use((res)=>{})` -->


自定义请求函数
```js
Fetch(()=>{
 return axios.get(`url`)
})
```