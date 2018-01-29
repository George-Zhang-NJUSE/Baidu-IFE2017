(function () {

    'use strict';

    class Observer {

        constructor(initState) {
            this._store = initState;
            this.data = {};     // _store的proxy
            this._makeReactive(this.data, this._store);
        }

        _makeReactive(proxy, store) {
            Object.getOwnPropertyNames(store).forEach(key => {

                const subProxy = { ref: null };
                if (typeof store[key] === 'object') {
                    subProxy.ref = {};
                    this._makeReactive(subProxy.ref, store[key]);
                }
                Object.defineProperty(proxy, key, {
                    enumerable: true,
                    configurable: true,
                    get: () => {
                        console.log('你访问了' + key);
                        const original = store[key];
                        return typeof original === 'object' ? subProxy.ref : original;
                    },
                    set: (value) => {
                        if (typeof value === 'object') {
                            subProxy.ref = {}
                            this._makeReactive(subProxy.ref, value);
                        }
                        console.log(`你设置了${key}，新的值为${value}`);
                        store[key] = value;
                    }
                });

            });
        }

        /**
         * 检测某个属性值的变化
         * @param {string} dataKey 以'-'分隔的对象键名，如需检测data.a.b.c，则传入'a-b-c'
         * @param {(changeValue:any)=>any} callback 被观测的值改变时执行的回调函数
         */
        $watch(dataKey, callback) {
            const paths = dataKey.split('-');
            const finalKey = paths.pop();

            let walker = this.data;
            paths.forEach(key => {
                walker = walker[key];
            });

            // 此时walker指向直接包含目标属性的那个对象proxy
            const { get, set } = Object.getOwnPropertyDescriptor(walker, finalKey);
            const newSetter = (value) => {
                const prevValue = get();
                set(value);
                if (value !== prevValue) {
                    callback(value);
                }      
            };

            Object.defineProperty(walker, finalKey, {
                enumerable: true,
                configurable: true,
                get: get,
                set: newSetter
            });
        }

    }

    let app1 = new Observer({
        name: 'youngwind',
        age: 25
    });

    app1.data.name = {
        lastName: 'liang',
        firstName: 'shaofeng'
    };

    app1.data.name.lastName;
    // 输出 '你访问了 lastName '
    app1.data.name.firstName = 'lalala';
    // 输出 '你设置了firstName, 新的值为 lalala'

    app1.$watch('age', changedAge => {
        console.log(`我的年纪变了，现在已经是：${changedAge}岁了`);
    });

    app1.data.age = 100; // 输出：'我的年纪变了，现在已经是100岁了'

    let app2 = new Observer({
        a: 1,
        b: 2,
        c: {
            d: 3,
            e: 4
        }
    });

    app2.$watch('c-e', changedValue => {
        console.log(`新的e值出现了：${changedValue}`);
    })

    app2.data.a;
    app2.data.c;
    app2.data.c.d;
    app2.data.c.e++;

})();
