(function () {
    'use strict';

    const MAX_X = 10, MAX_Y = 10;
    const DIRECTION = {
        UP: 0,
        RIGHT: 1,
        DOWN: 2,
        LEFT: 3
    };

    const state = {
        currentLoc: {
            x: Math.round((1 + MAX_X) / 2),       // 最小为1，最大为MAX_X
            y: Math.round((1 + MAX_Y) / 2)
        },
        direction: DIRECTION.UP
    }

    const form = document.forms[0];
    form.addEventListener('submit', handleSubmit);

    const table = generateTable(MAX_X, MAX_Y);
    document.querySelector('#container').appendChild(table);

    const block = document.querySelector('#block');
    draw();

    const actionInput = form.querySelector('#action-input');

    function handleSubmit(event) {
        event.preventDefault();
        const input = actionInput.value;
        actionInput.value = '';
        if (!act(input)) {
            alert('指令输入错误');
        }
    }

    /**
     * 生成一个rowNum*columnNum的棋盘，此外还附加一行和一列的数字标号
     * @param {number} rowNum 棋盘主体行数
     * @param {number} columnNum 棋盘主体列数
     * @returns {HTMLTableElement} 生成的棋盘元素
     */
    function generateTable(rowNum, columnNum) {
        const table = document.createElement('table');

        // 生成数字标号行
        const indexRow = document.createElement('tr');
        for (let column = 0; column < columnNum + 1; column++) {
            const cell = document.createElement('td');
            column > 0 && (cell.textContent = column);
            indexRow.appendChild(cell);
        }
        table.appendChild(indexRow);

        // 生成棋盘主体及数字标号列
        for (let row = 0; row < rowNum; row++) {
            const rowElem = document.createElement('tr');
            const indexCell = document.createElement('td');
            indexCell.textContent = row + 1;
            rowElem.appendChild(indexCell);

            for (let column = 0; column < columnNum; column++) {
                rowElem.appendChild(document.createElement('td'));
            }
            table.appendChild(rowElem);
        }

        return table;
    }

    /**
     * 根据state，在table上对应位置画出方块
     */
    function draw() {
        // 设置位置
        const { x, y } = state.currentLoc;
        const actualRow = y + 1, actualColumn = x + 1;
        const cell = table.querySelector(`tr:nth-child(${actualRow}) > td:nth-child(${actualColumn})`);
        block.style.left = cell.offsetLeft + 'px';
        block.style.top = cell.offsetTop + 'px';

        // 设置方向
        const rotateDeg = state.direction * 90;
        block.style.transform = `rotate(${rotateDeg}deg)`;
    }

    /**
     * 方块朝指定方向走一格
     * @param {number} direction 
     */
    function go(direction) {
        const { x, y } = state.currentLoc;
        switch (direction) {
            case DIRECTION.UP:
                state.currentLoc.y = Math.max(y - 1, 1);
                break;
            case DIRECTION.RIGHT:
                state.currentLoc.x = Math.min(x + 1, MAX_X);
                break;
            case DIRECTION.DOWN:
                state.currentLoc.y = Math.min(y + 1, MAX_Y);
                break;
            case DIRECTION.LEFT:
                state.currentLoc.x = Math.max(x - 1, 1);
                break;
        }
        draw();
    }

    /**
     * 方块根据指令转向
     * @param {'LEF' | 'RIG' | 'BAC'} order 
     */
    function turn(order) {
        switch (order) {
            case 'LEF':
                state.direction -= 1;
                break;
            case 'RIG':
                state.direction += 1;
                break;
            case 'BAC':
                state.direction += 2;
                break;
        }

        // 修正溢出
        if (state.direction < 0) {
            state.direction += 4;
        } else if (state.direction > 3) {
            state.direction -= 4;
        }

        draw();
    }

    /**
     * 解析指令并行动
     * @param {string} input 
     * @returns {boolean} 指令是否解析成功
     */
    function act(input) {
        const instruction = input.trim().toUpperCase();
        const parts = instruction.split(' ');

        if (parts[0] === 'GO') {
            go(state.direction);
            return true;
        }

        if (parts[0] === 'TUN' || parts[0] === 'TUR') {
            turn(parts[1]);
            return true;
        }

        return false;
    }

})();
