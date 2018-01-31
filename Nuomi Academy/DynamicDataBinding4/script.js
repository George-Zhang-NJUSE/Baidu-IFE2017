(function () {

    'use strict';

    class Vue {

        constructor({ el, data }) {
            this._node = document.querySelector(el);
            this._store = data;
            this.data = {};     // _store的proxy
            this._makeReactive(this.data, this._store);
            this._bindDOMNode(this._node);
        }

        /**
         * 将实例绑定到DOM节点上，并重新渲染DOM节点
         * @param {HTMLElement} node 
         */
        _bindDOMNode(node) {
            node.innerHTML = node.innerHTML.replace(/{{(\w+(?:\.\w+)*)}}/g, (matchedStr, dataKey) => this._getValue(dataKey));
        }

        _makeReactive(proxy, store) {
            Object.getOwnPropertyNames(store).forEach(key => {

                let subProxy = null;
                if (typeof store[key] === 'object') {
                    subProxy = {};
                    this._makeReactive(subProxy, store[key]);
                }
                Object.defineProperty(proxy, key, {
                    enumerable: true,
                    configurable: true,
                    get: () => {
                        const original = store[key];
                        return typeof original === 'object' ? subProxy : original;
                    },
                    set: (value) => {
                        if (typeof value === 'object') {
                            subProxy = {}
                            this._makeReactive(subProxy, value);
                        }
                        store[key] = value;
                    }
                });

            });
        }

        /**
         * 获取data上任意层的属性值
         * @param {string} dataKey 以'.'分隔的对象键名，如需取data.a.b.c，则传入'a.b.c'
         */
        _getValue(dataKey) {
            const paths = dataKey.split('.');
            let walker = this.data;
            paths.forEach(key => {
                walker = walker[key];
            });
            return walker;
        }

        /**
         * 监听proxy对象上某个属性的变化
         * @param {object} proxy 
         * @param {string} key 
         * @param {(changedValue:any)=>void} callback 
         * @param {boolean} isDeepMode 是否递归监听所有子属性，若是，则子属性变化时，也将使用顶层属性（即直接传入的属性）值调用回调
         */
        _subscribeChange(proxy, key, callback, isDeepMode = false) {

            const getTopLevelValue = () => proxy[key];

            const subscribeRecursive = (proxy, key, callback, isDeepMode = false) => {
                const { get, set } = Object.getOwnPropertyDescriptor(proxy, key);
                const newSetter = (value) => {
                    const prevValue = get();
                    set(value);
                    if (value !== prevValue) {
                        callback(isDeepMode ? getTopLevelValue() : value);
                    }
                };

                Object.defineProperty(proxy, key, {
                    enumerable: true,
                    configurable: true,
                    get: get,
                    set: newSetter
                });

                const subProxy = proxy[key];
                if (isDeepMode && typeof subProxy === 'object') {
                    Object.getOwnPropertyNames(subProxy).forEach(subKey => {
                        subscribeRecursive(subProxy, subKey, callback, true);
                    })
                }
            }

            subscribeRecursive(proxy, key, callback, isDeepMode);

        }

        /**
         * 订阅某个属性值的变化
         * @param {string} dataKey 以'.'分隔的对象键名，如需检测data.a.b.c，则传入'a.b.c'
         * @param {(changedValue:any)=>any} callback 被检测的值改变时执行的回调函数
         * @param {boolean} isDeepMode 检测深层变化，即该属性下的任意后代属性变化，也将触发回调，返回被订阅的属性值
         */
        $watch(dataKey, callback, isDeepMode = false) {
            const paths = dataKey.split('.');
            const finalKey = paths.pop();

            let walker = this.data;
            paths.forEach(key => {
                walker = walker[key];
            });

            // 此时walker指向直接包含目标属性的那个对象proxy
            this._subscribeChange(walker, finalKey, callback, isDeepMode);
        }

    }

    let app = new Vue({
        el: '#app',
        data: {
            user: {
                name: 'youngwind',
                age: 25
            }
        }
    });

})();
