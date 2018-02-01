(function () {

    'use strict';

    class Menu {

        /**
         * @param {string[]} menuItems 显示的菜单条目
         * @param {HTMLElement} mountNode 挂载的父元素，该元素需为positioned
         */
        constructor(menuItems, mountNode) {

            // 构建自身DOM结构
            const node = document.createElement('div');
            node.innerHTML = `
                <ul>
                    ${menuItems.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
            node.querySelector('ul').addEventListener('click', event => {
                alert(event.target.textContent);
            });
            node.classList.add('menu', 'hidden');
            mountNode.appendChild(node);

            // 为父节点绑定相关事件
            mountNode.addEventListener('contextmenu', event => {
                event.preventDefault();
                event.stopPropagation();
                const { offsetX, offsetY } = event;
                this.showAt(offsetX, offsetY);
            })

            // 点击其他区域隐藏菜单
            const hideSelf = () => this.hide();
            document.addEventListener('click', hideSelf);
            document.addEventListener('contextmenu', hideSelf);

            this._node = node;
        }

        showAt(x, y) {
            const { clientWidth, clientHeight } = this._node.parentElement;
            const { clientWidth: ownWidth, clientHeight: ownHeight } = this._node;

            const rightAvailable = x + ownWidth < clientWidth;
            const leftAvailable = x - ownWidth > 0;
            const topAvailable = y - ownHeight > 0;
            const bottomAvailable = y + ownHeight < clientHeight;

            if (!(leftAvailable || rightAvailable) || !(topAvailable || bottomAvailable)) {
                return console.error('没有足够空间来显示菜单！');
            }

            const left = rightAvailable ? x : x - ownWidth;
            const top = bottomAvailable ? y : y - ownHeight;

            this._node.style.left = left + 'px';
            this._node.style.top = top + 'px';
            this._node.classList.remove('hidden');
        }

        hide() {
            this._node.classList.add('hidden');
        }

    }

    const items = ['西瓜', '苹果', '梨', '火龙果'];
    new Menu(items, document.querySelector('#customed-area'));



})();
