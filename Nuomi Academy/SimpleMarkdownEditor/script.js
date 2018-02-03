(async function () {

    'use strict';

    const editor = document.querySelector('.editor');
    const preview = document.querySelector('.preview');
    const TAB = '    ';

    const parse = compose(parseNewLine, parseHeaders, parseCodeBlock, parseInlineCode, parseQuote);
    const render = () => {
        preview.innerHTML = parse(editor.value);
    };

    editor.addEventListener('change', render)
    editor.addEventListener('keydown', event => {
        if (event.keyCode === 9) {
            // 按tab键时插入tab，而不是转移焦点
            event.preventDefault();

            let startPos = editor.selectionStart,
                endPos = editor.selectionEnd,
                cursorPos = startPos,
                tmpStr = editor.value;
            editor.value = tmpStr.substring(0, startPos) + TAB + tmpStr.substring(endPos, tmpStr.length);
            cursorPos += tab.length;
            editor.selectionStart = editor.selectionEnd = cursorPos;
        }
    })

    // 读取示例文本
    // const response = await fetch('demo.txt');
    // const demoText = await response.text();
    // editor.value = demoText;



    /**
     * 组合多个纯函数，完成链式调用，返回组合后的函数
     * @param {((text:string)=>string)[]} pureFuncs 
     */
    function compose(...pureFuncs) {
        return function (text) {
            let arg = text;
            for (let func of pureFuncs) {
                arg = func(arg);
            }
            return arg;
        }
    }

    /**
     * 必须最先被调用
     * 将换行符替换为对应html文本（br），在首尾也添加换行，并返回
     * @param {string} text makedown文本
     */
    function parseNewLine(text) {
        return text.replace(/\r\n|\n|$|^/g, '<br>');
    }

    /**
     * 将#标注的标题替换为对应html文本（h1-h6）并返回
     * @param {string} text makedown文本
     */
    function parseHeaders(text) {
        return text.replace(/<br>(#{1,6}) ?(.+?)(?=<br>)/g, (matchedStr, hashtags, content) => {
            const tagName = 'h' + hashtags.length;
            return `<br><${tagName}>${content}</${tagName}>`;
        });
    }

    /**
     * 将markdown中的列表替换为对应html文本（ol,ul）并返回
     * @param {string} text makedown文本
     */
    function parseList(text) {
        // 先定位到列表文本
        return text.replace(/(<br>(    )*([1-9]\d*\.|\*) ?.+?(?=<br>))+/g, matchedStr => {
            // 对列表文本进行处理
            matchedStr = /^<br>\*/.test(matchedStr) ? `<ul>${matchedStr}</ol>` : `<ol>${matchedStr}</ol>`;

            const inner = matchedStr.replace(/<br>([1-9]\d*\.|\*) ?/g, '<br>')  // 去掉标号
                .replace(/<br>(.+?(?:<br>(    )+.+?))/g, (matchedStr,content) => {
                    return `<li>${parseList(content)}</li>`
                })
                .replace()
            return parseQuote(inner);
        })
    }

    /**
     * 将markdown中的引用(>位于行首)替换为对应html文本（blockquote）并返回
     * 支持单行引用、多行引用、引用嵌套
     * @param {string} text makedown文本
     */
    function parseQuote(text) {
        // 先定位到引用文本
        return text.replace(/(?:<br>>+ ?.+?(?=<br>))+<br>/g, matchedStr => {
            // 对引用文本进行处理
            const inner = matchedStr.replace(/<br>> ?/, '<blockquote>').replace(/<br>> ?/g, '<br>').concat('</blockquote>');
            return parseQuote(inner);
        });
    }

    /**
     * 将markdown中的代码块(```或tab缩进，上面有一个空行)替换为对应html文本（code class=code-block）并返回
     * 不支持标注编程语言类型及语法高亮
     * @param {string} text makedown文本
     */
    function parseCodeBlock(text) {
        // 处理content中的tab，使其不被html忽略, offset表示从第几个tab开始算缩进
        const parseContentTab = (content, offset = 0) => content.replace(/<br>((?:    )+)/g, (matchedStr, tabs) => {
            const validTabNum = tabs.length / TAB.length - offset;
            const tabElements = Array(validTabNum).fill(0).map(() => '<span class="tab"></span>');
            return `<br>${tabElements.join('')}`;
        });

        return text.replace(
            // 先匹配```
            /<br><br>```<br>((?:.+?<br>)+)```<br>/g,
            (matchedStr, content) => `<br><code class="code-block">${parseContentTab(content)}</code>`
        ).replace(
            // 后匹配tab
            /<br><br>((?:    .+?<br>)+)/g,
            (matchedStr, content) => `<br><code class="code-block">${parseContentTab(content, 1)}</code>`
            );
    }

    /**
     * 将markdown中的内联代码(``)替换为对应html文本（code class=code-inline）并返回
     * @param {string} text makedown文本
     */
    function parseInlineCode(text) {
        return text.replace(/`(.+)`/g, (matchedStr, content) => `<code class="code-inline">${content}</code>`);
    }

})();