export interface customRequestInit extends RequestInit {
  Timeout: number
  onTimeout?: (url: string) => void
}

export default class Core {
  static instance: Core

  static getInstance() {
    if (false === this.instance instanceof this) {
      this.instance = new this;
    }
    return this.instance;
  }
  // 考虑依赖注入方式实现
  interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  }

  defaultOption: RequestInit = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: null,
    credentials: 'same-origin',
    cache: 'default',
    redirect: 'follow',
    referrer: 'client',
    referrerPolicy: 'origin',
  }

  customOption: customRequestInit = {
    Timeout: 1000
  }
  setOption = (customOption: customRequestInit) => {
    this.customOption = { ...this.customOption, ...customOption }
  }

  run = async (url: string, init?: RequestInit | undefined): Promise<Response> => {
    const { Timeout, onTimeout, ...customOption } = this.customOption
    let opt = this.transformRequest({ ...customOption, ...init });
    let res: Response
    let controller: AbortController
    let signal: AbortSignal
    try {
      for (let requestItem of this.interceptors.request.handlers) {
        opt = await requestItem(opt)
      }
      if (!opt.signal) {
        controller = new AbortController()
        signal = controller.signal
        opt.signal = signal
      }
      res = await Promise.race<Promise<Response>>([
        fetch(new Request(url, { ...this.defaultOption, ...opt })),
        new Promise<Response>((resolve, reject) => {
          setTimeout(() => {
            controller.abort()
            const init = { "status": 10004, "statusText": `${url}: timeout!` };
            reject(init);
            onTimeout?.(url)
          }, Timeout);
        })
      ])
      for (let responseItem of this.interceptors.response.handlers) {
        res = await responseItem(res) as Response
      }
      return res;
    }
    catch (e) {
      throw new Error(JSON.stringify(e))
    }
  }

  transformRequest = (opt: RequestInit): RequestInit => {
    if (opt.method) opt.method = opt.method.toUpperCase()
    if (opt.method === 'POST' && !opt.headers) {
      opt.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }
    }
    if (opt.method === 'POST' && Object.prototype.toString.call(opt.body) === '[object Object]') {
      opt.headers = { 'Content-Type': 'application/json;charset=utf-8' }
      opt.body = JSON.stringify(opt.body)
    }
    return opt
  }
}

interface Config {
  (config: RequestInit): RequestInit | Response
}
class InterceptorManager {
  handlers: Config[] = [];
  use = (fun: Config) => {
    this.handlers.push(fun);
    // 返回当前的索引，用于移除已注册的拦截器
    return this.handlers.length - 1;
  };
}