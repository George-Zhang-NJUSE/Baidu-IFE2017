(function () {

    'use strict';

    /**
     * 判断字符串是否为手机号码
     * @param {string} input 
     */
    function isPhoneNum(input) {
        if (/^1\d{10}$/.test(input)) {
            // 格式正确，检查号码段是否合法
            const validPrefixes = [
                '13', '145', '147', '149', '150', '151', '152', '153', '155', '156', '157', '158',
                '159', '166', '170', '171', '173', '175', '176', '177', '178', '18', '198', '199'
            ];
            for (let prefix of validPrefixes) {
                if (input.startsWith(prefix)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 判断字符串中是否有相邻的单词
     * @param {string} input 
     */
    function hasSameAdjacentWords(input) {
        return /(?:^|\s)(\w+)\s+\1(?:$|\s)/.test(input);
    }

    /**
     * 运行测试用例
     * @param {{input:string, assert:boolean}[]} testCases 
     * @param {(input:string)=>boolean} testMethod 
     */
    function runTests(testCases, testMethod) {
        console.log(`开始测试${testMethod.name}`);
        testCases.forEach(test => {
            const output = testMethod(test.input);
            if (output === test.assert) {
                console.log(`${testMethod.name}测试通过`);
            } else {
                console.error(`${testMethod.name}测试失败：输入：${test.input} 理应输出：${test.assert} 实际输出：${output}`);
            }
        })
    }

    const phoneNumTests = [{
        input: '18812011232',
        assert: true
    }, {
        input: '18812312',
        assert: false
    }, {
        input: '12345678909',
        assert: false
    }];

    const adjacentWordTests = [{
        input: 'foo foo bar',
        assert: true
    }, {
        input: 'foo bar foo',
        assert: false
    }, {
        input: 'foo  barbar bar',
        assert: false
    },{
        input: 'foo  bar     bar foo',
        assert: true
    }, {
        input: 'wfoo foo zbar bar',
        assert: false
    }, {
        input: 'foo     foo zbar bar',
        assert: true
    }];

    runTests(phoneNumTests, isPhoneNum);
    runTests(adjacentWordTests, hasSameAdjacentWords);

})();