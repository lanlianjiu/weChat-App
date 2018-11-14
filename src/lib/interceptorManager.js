/**
 * 注册拦截器
 */
class interceptorManager {
    constructor() {
        this.interceptors = []
        this.currentPriority = 1000;
    }

    bulidInterceptor(interceptors) {
        if (!interceptors
            || interceptors.length == 0) {
            return this.interceptors
        }
        var interceptorList = [];

        for (var i in this.interceptors) {
            interceptorList.push(this.interceptors[i])
        }

        for (var i in interceptors) {
            interceptorList.push(interceptors[i])
        }
        this.sortInterceptor(interceptorList)

        return interceptorList
    }

    sortInterceptor(interceptors) {
        interceptors.sort(function (a, b) {
            if (a.priority > b.priority) {
                return -1;
            }
            if (a.priority < b.priority) {
                return 1;
            }
            return 0;
        })
    }
    
    /**
     * 添加一个拦截器
     */
    use(interceptor) {
        if (!interceptor) {
            return;
        }
        if (!interceptor.priority) {
            interceptor.priority = this.currentPriority--
        }
        this.interceptors.push(interceptor)
        this.sortInterceptor(this.interceptors)
    }
    
    /**
     * 移除一个拦截器
     */
    eject(id) {
        if (this.interceptors[id]) {
            this.interceptors[id] = null
        }
    }

    /**
     * 遍历所有已注册的拦截器
     */
    forEach(fn) {
        this.interceptors.forEach(h => {
            if (h !== null) {
                fn(h)
            }
        })
    }
}

export default new interceptorManager