import { OFFSET_Y, BLOCK_WIDTH } from './constants';

export class Block {

    width = BLOCK_WIDTH;
    coordinateY: number;

    constructor(
        public height: number,
        public context: CanvasRenderingContext2D,
        public coordinateX: number = 0
    ) {
        this.coordinateY = context.canvas.height - OFFSET_Y - height;
    }

    draw() {
        const { context, coordinateX, coordinateY, height, width } = this;
        context.fillStyle = '#fd0100';
        context.strokeStyle = 'white';
        context.fillRect(coordinateX, coordinateY, width, height);
        context.strokeRect(coordinateX, coordinateY, width, height);
        context.fillStyle = 'white';
        context.textAlign = 'center';
        // 默认字体为10px sans-serif
        context.fillText(height.toString(), coordinateX + width / 2, coordinateY + height / 2 + 5, width); 
    }

}