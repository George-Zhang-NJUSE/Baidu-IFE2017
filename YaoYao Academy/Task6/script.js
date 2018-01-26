(function () {
    'use strict';

    class Modal {

        /**
         * location 可取值为'center' | 'top' | 'bottom'
         */
        constructor({ title, content, location, onCancel, onConfirm }) {
            this.setProperties({ title, content, location, onCancel, onConfirm });
            this.isHidden = true;

            // 构建dom节点
            const container = document.createElement('div');
            container.innerHTML = `
                <div class="modal">
                    <header class="title">${title}</header>
                    <div class="content">${content}</div>
                    <div class="action">
                        <button class="normal">取消</button>
                        <button class="primary">确定</button>
                    </div>
                </div>
                <div class="outer"></div>
            `;
            container.classList.add('modal-container', 'hidden');

            // 设置点击逻辑
            container.querySelector('.outer').addEventListener('click', () => this.handleCancel());
            container.querySelector('.normal').addEventListener('click', () => this.handleCancel());
            container.querySelector('.primary').addEventListener('click', () => this.handleConfirm());

            this.modal = container.querySelector('.modal');
            this.container = container;
            document.body.appendChild(this.container);
        }

        setProperties({
            title,
            content,
            location = 'center',
            onCancel = () => { },
            onConfirm = () => { }
         }) {
            this.title = title;
            this.content = content;
            this.location = location;
            this.onCancel = onCancel;
            this.onConfirm = onConfirm;
        }

        handleCancel() {
            this.hide();
            this.onCancel();
        }

        handleConfirm() {
            this.hide();
            this.onConfirm();
        }

        show() {
            if (this.isHidden) {
                this.container.classList.remove('hidden');
                this.modal.classList.add(this.location);
                this.isHidden = false;
            }
        }

        hide() {
            if (!this.isHidden) {
                this.container.classList.add('hidden');
                this.modal.className = 'modal';
                this.isHidden = true;
            }
        }

        destroy() {
            // 在老旧IE浏览器上需要手动移除EventListener以避免内存泄漏，在现代浏览器上不需要
            // 本代码仅针对现代浏览器（废话，都用了ES6了，旧IE肯定不兼容啦）
            this.container.remove();
        }

    }

    const centerModal = new Modal({
        title: '模态框Demo',
        content: '这是一个模态框啊说都哈好请问请问请问请问认为认为热望佛i上的佛号但是'
    });

    const topModal = new Modal({
        title: '模态框Demo',
        content: '这是一个模态框啊说都哈好请问请问请问请问认为认为热望佛i上的佛号但是asdsadqqqz阿斯都i阿松i说的话阿斯顿钱钱钱',
        location: 'top'
    })

    const bottomModal = new Modal({
        title: '模态框Demo',
        content: '这是一个模态框啊说都哈qweqweqweadsadzxc好请问请问请问请问认为认为热望佛i上的佛号但是asdsadqqqz阿斯都i阿松i说的话阿斯顿钱钱钱',
        location: 'bottom'
    })

    document.querySelector('#show-center-btn').addEventListener('click', () => centerModal.show());
    document.querySelector('#show-top-btn').addEventListener('click', () => topModal.show());
    document.querySelector('#show-bottom-btn').addEventListener('click', () => bottomModal.show());
})();
