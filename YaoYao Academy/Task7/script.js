(function () {
    'use strict';

    class Table {

        /**
         * columns 代表表头，为由各个列配置构成的数组
         * data 为由各行数据构成的数组
         */
        constructor({ mountNode, title, columns, data = [] }) {
            this.data = data;
            this.dataKeys = [];
            // 构建dom节点
            const node = document.createElement('table');
            node.innerHTML = `
                <caption>${title}</caption>
            `;
            node.appendChild(this.createTableHeader(columns));
            this.body = this.createTableBody();
            this.renderData();
            node.appendChild(this.body);

            this.node = node;
            mountNode.appendChild(node);
        }

        defaultCompare(a, b) {
            if (a < b) {
                return -1;
            } else if (a == b) {
                return 0;
            } else if (a > b) {
                return 1;
            }
        }

        /**
         * 获取一个嵌套对象的处于任意层的键值
         * @param {{}} obj 要访问的对象
         * @param {string} dataKey 以'-'分隔的键，例如访问obj.a.b.c，则传入'a-b-c'
         */
        getValue(obj, dataKey) {
            const paths = dataKey.split('-');
            let walker = obj;
            paths.forEach(key => {
                walker = walker[key];
            });
            return walker;
        }

        appendSortControls(tableCell, dataKey, compareFunc = this.defaultCompare) {
            tableCell.classList.add('with-control');
            const container = document.createElement('div');
            container.classList.add('sort-container');
            container.innerHTML = `
                <input type="radio" name="sort" class="up"></input>
                <input type="radio" name="sort" class="down"></input>
            `;
            const sortUp = container.querySelector('.up');
            const sortDown = container.querySelector('.down');
            sortUp.addEventListener('click', () => this.sort(dataKey, false, compareFunc));
            sortDown.addEventListener('click', () => this.sort(dataKey, true, compareFunc));
            tableCell.appendChild(container);
        }

        createTableHeader(columns) {
            const tableHeader = document.createElement('thead');
            const headerRows = Array(this.countTotalHeaderRows(columns)).fill(0).map(() => document.createElement('tr'));

            const createHeaderCell = (column, depth) => {
                const elem = document.createElement('th');
                elem.textContent = column.name;
                if (column.sortable) {
                    this.appendSortControls(elem, column.dataKey, column.compareFunc);
                }
                if (column.subColumns) {
                    elem.colSpan = this.countColumnSpan(column);
                    column.subColumns.forEach(subCol => createHeaderCell(subCol, depth + 1));
                } else {
                    // 基本列
                    this.dataKeys.push(column.dataKey);
                    // 纵向拉伸至整个表头区域
                    elem.rowSpan = headerRows.length - depth;
                }
                headerRows[depth].appendChild(elem);
            }

            columns.forEach(col => createHeaderCell(col, 0));
            headerRows.forEach(row => tableHeader.appendChild(row));
            return tableHeader;
        }

        createTableBody() {
            const tableBody = document.createElement('tbody');
            this.data.forEach(() => {
                const row = document.createElement('tr');
                this.dataKeys.forEach(() => {
                    row.appendChild(document.createElement('td'));
                })
                tableBody.appendChild(row);
            })
            return tableBody;
        }

        /**
         * 计算某列包含多少基本列（colspan）
         * @param {{}} column 单列的配置，既可能是基本列也可能是复合列
         * @returns {number}
         */
        countColumnSpan(column) {
            if (column.subColumns) {
                // 为复合列
                return column.subColumns.reduce((accu, next) => accu + this.countColumnSpan(next), 0);
            } else {
                // 为基本列
                return 1;
            }
        }

        /**
         * 计算表头应有多少行
         * @param {any[]} columns 所有列的配置数组
         */
        countTotalHeaderRows(columns) {
            const countRowSpan = column => {
                if (column.subColumns) {
                    // 为复合列
                    return 1 + Math.max(...column.subColumns.map(subCol => countRowSpan(subCol)));
                } else {
                    // 为基本列
                    return 1;
                }
            };
            return Math.max(...columns.map(col => countRowSpan(col)));
        }

        // 默认升序
        sort(dataKey, reverse = false, compareFunc = this.defaultCompare) {
            this.data.sort((a, b) => {
                const compareResult = compareFunc(this.getValue(a, dataKey), this.getValue(b, dataKey));
                return reverse ? -compareResult : compareResult;
            });
            this.renderData();
        }

        /**
         * 根据当前数据，填充表中单元格，不会改变表中单元格个数及表头结构
         * 调用此方法时，this.data的length与this.body中行数相同
         */
        renderData() {
            const rows = Array.from(this.body.children);
            const renderRow = (tableRow, dataItem) => {
                const cells = Array.from(tableRow.children);
                cells.forEach((cell, index) => {
                    cell.textContent = this.getValue(dataItem, this.dataKeys[index]);
                })
            };
            this.data.forEach((item, index) => {
                renderRow(rows[index], item);
            });
        }

        destroy() {
            this.node.remove();
        }

    }

    const data = [{
        name: '小明',
        studentId: '154215219',
        assessment: '优',
        scores: {
            chinese: 80,
            math: 92,
            english: {
                oral: 76,
                written: 68,
                total: 70
            },
            total: 242
        }
    }, {
        name: '小红',
        studentId: '154215233',
        assessment: '良',
        scores: {
            chinese: 72,
            math: 89,
            english: {
                oral: 86,
                written: 98,
                total: 96
            },
            total: 257
        }
    }, {
        name: '张三',
        studentId: '154215235',
        assessment: '中',
        scores: {
            chinese: 93,
            math: 99,
            english: {
                oral: 85,
                written: 88,
                total: 87
            },
            total: 279
        }
    }, {
        name: '李四',
        studentId: '154215215',
        assessment: '差',
        scores: {
            chinese: 73,
            math: 59,
            english: {
                oral: 56,
                written: 78,
                total: 74
            },
            total: 206
        }
    }];

    const compareAssessment = (a, b) => {
        const order = ['差', '中', '良', '优'];
        return order.indexOf(a) - order.indexOf(b);
    }

    const table = new Table({
        mountNode: document.querySelector('#container'),
        title: '学生信息表',
        data,
        columns: [{
            name: '姓名',
            dataKey: 'name'
        }, {
            name: '学号',
            dataKey: 'studentId',
            sortable: true
        }, {
            name: '行为考评',
            dataKey: 'assessment',
            sortable: true,
            compareFunc: compareAssessment
        }, {
            name: '考试成绩',
            subColumns: [{
                name: '语文',
                dataKey: 'scores-chinese',
                sortable: true
            }, {
                name: '数学',
                dataKey: 'scores-math',
                sortable: true
            }, {
                name: '英语',
                subColumns: [{
                    name: '口语',
                    dataKey: 'scores-english-oral',
                    sortable: true
                }, {
                    name: '卷面',
                    dataKey: 'scores-english-written',
                    sortable: true
                }, {
                    name: '总评',
                    dataKey: 'scores-english-total',
                    sortable: true
                }]
            }, {
                name: '总分',
                dataKey: 'scores-total',
                sortable: true
            }]
        }]
    });

})();
