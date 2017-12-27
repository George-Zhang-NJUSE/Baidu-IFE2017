import { List } from './List';

const input = <HTMLInputElement>document.querySelector('#input');
const container = <HTMLCanvasElement>document.querySelector('#container');
container.width = window.innerWidth;
container.height = 300;

const list = new List(container.getContext('2d')!);

function getInput() {
    const content = +input.value.trim();
    input.value = '';

    if (isNaN(content)) {
        return alert('请输入数字');
    }

    if (!(content >= 10 && content <= 100)) {
        return alert('输入数字的有效范围为10~100');
    }

    return content;
}

function handleLeftIn() {
    const content = getInput();
    if (content) {
        list.leftIn(content);
    }
}

function handleRightIn() {
    const content = getInput();
    if (content) {
        list.rightIn(content);
    }
}

document.querySelector('#left-in')!.addEventListener('click', handleLeftIn);
document.querySelector('#right-in')!.addEventListener('click', handleRightIn);
document.querySelector('#left-out')!.addEventListener('click', list.leftOut);
document.querySelector('#right-out')!.addEventListener('click', list.rightOut);
document.querySelector('#sort')!.addEventListener('click', () => list.sort());