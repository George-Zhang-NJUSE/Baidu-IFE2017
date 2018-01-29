(function () {
    'use strict';
    class Observer {
        constructor(initState) {
            this._store = initState;
            this.data = {};     // _store的proxy
            Object.getOwnPropertyNames(initState).forEach(key => {
                Object.defineProperty(this.data, key, {
                    enumerable: true,
                    configurable: false,
                    get: () => {
                        console.log('你访问了' + key);
                        return this._store[key];
                    },
                    set: (value) => {
                        console.log(`你设置了${key}，新的值为${value}`);
                        this._store[key] = value;
                    }
                })
            });
        }
    }

    let app1 = new Observer({
        name: 'youngwind',
        age: 25
    });

    let app2 = new Observer({
        university: 'bupt',
        major: 'computer'
    });

    app1.data.name; // 你访问了 name
    app1.data.age = 120;  // 你设置了 age，新的值为120
    app1.data.age++;
    app2.data.university; // 你访问了 university
    app2.data.major = 'science';  // 你设置了 major，新的值为 science

})();
