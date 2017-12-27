import { Block } from './Block';
import { BLOCK_WIDTH } from './constants';

export class List {

    blockList: Block[] = [];

    constructor(public context: CanvasRenderingContext2D) { }

    private render() {
        const canvas = this.context.canvas;
        this.context.clearRect(0, 0, canvas.width, canvas.height);
        this.blockList.forEach(block => block.draw());
    }

    private rearrange() {
        const { blockList, context } = this;
        if (blockList.length > 0) {
            const startX = (context.canvas.width - blockList.length * BLOCK_WIDTH) / 2;
            blockList.forEach((block, index) => {
                block.coordinateX = startX + index * BLOCK_WIDTH;
            });
        }
        this.render();
    }

    private async swap(indexA: number, indexB: number) {

        const { blockList } = this;
        const blockA = blockList[indexA];
        const blockB = blockList[indexB];
        
        // 动画
        let distanceToGo = Math.abs(blockA.coordinateX - blockB.coordinateX);
        const [leftOne, rightOne] = [blockA, blockB].sort((a, b) => a.coordinateX - b.coordinateX);

        return new Promise((resolve, reject) => {
            const animate = () => {
                if (distanceToGo === 0) {
                    return resolve();
                }
                const length = Math.ceil(distanceToGo / 10);
                leftOne.coordinateX += length;
                rightOne.coordinateX -= length;
                distanceToGo -= length;
                this.render();
                requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
        }).then(() => {
            // 交换实际数据
            blockList[indexA] = blockB;
            blockList[indexB] = blockA;
        });

    }

    private add(addMethod: (this: Block[], block: Block) => void, block: Block) {
        if (this.blockList.length >= 60) {
            return alert('元素过多，不能继续添加');
        }
        addMethod.call(this.blockList, block);
        this.rearrange();
    }

    private remove(removeMethod: (this: Block[]) => Block | undefined) {
        if (this.blockList.length > 0) {
            const removedBlock: Block = removeMethod.call(this.blockList);
            this.rearrange();
            alert('删除的内容为：' + removedBlock.height);
        }
    }

    async sort() {
        const { blockList } = this;
        for (let end = blockList.length; end > 1; end--) {
            for (let begin = 0; begin < end - 1; begin++) {
                if (blockList[begin].height > blockList[begin + 1].height) {
                    await this.swap(begin, begin + 1);
                }
            }
            await new Promise((resolve, reject) => {
                setTimeout(() => resolve(), 500);
            });  // 故意停顿一下
        }
    }

    leftIn(height: number) {
        this.add(this.blockList.unshift, new Block(height, this.context));
    }

    rightIn(height: number) {
        this.add(this.blockList.push, new Block(height, this.context));
    }

    leftOut = () => {
        this.remove(this.blockList.shift);
    }

    rightOut = () => {
        this.remove(this.blockList.pop);
    }
}