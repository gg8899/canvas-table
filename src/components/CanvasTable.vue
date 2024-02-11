<template>
    <div class="wrapper">
        <input type="text" @input="handleSearch">
        <canvas id="canvas" ref="canvasRef" width="1600" height="1200"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, reactive, watch } from "vue";
import { tableDataData } from '../config/tableData.ts'
import { throttle } from '../utils/index.ts'
let canvasRef = ref < HTMLCanvasElement | null > (null);
const selectedCell = reactive({ row: -1, col: -1 }); // 被选中的单元格。
const pixelRatio = window.devicePixelRatio;
const tableData = reactive({
    ...tableDataData,
    tempDataSource: tableDataData.dataSource,
});
let padding = 50, cellWidth = 100 * pixelRatio, cellHeight = 50 * pixelRatio;
let startRow = 0; // 可视区域的第一行
const visibleRows = Math.ceil(1200 / cellHeight) - 1; // 可视区域有多少行


// 填充背景色随机
const randomColor = () => {
    const randomNum = Math.random();
    if (randomNum > 0 && randomNum < 0.3) {
        return 'red';
    } else if (randomNum > 0.3 && randomNum < 0.6) {
        return 'blue';
    } else {
        return 'pink';
    }
}

// 监听事件
const handleClick = (ev) => {
    const { top, left } = canvasRef.getBoundingClientRect();
    const x = ev.clientX - left;
    const y = ev.clientY - top;
    // console.log(x, y);
    // 判断点击到了哪个单元格里面。
    const colIndex = Math.floor(x * pixelRatio / cellWidth);
    const rowIndex = Math.floor(y * pixelRatio / cellHeight) - 1;
    console.log(rowIndex, colIndex, '单元格');

    /* 如果被当前行列大于0小于数据的长度，说明已经有单元格被选中*/
    if (rowIndex >= 0 && rowIndex <= tableData.dataSource.length) {
        selectedCell.row = rowIndex + startRow;
        selectedCell.col = colIndex;
        // 重绘表格
        drawTables();
    }
}

const drawTables = () => {
    const ctx = canvasRef.getContext('2d');
    // 清除选中
    ctx.clearRect(0, 0, 1600, 1200);
    // 绘制表头
    tableData.column.forEach((item, index) => {
        ctx.font = "32px serif";
        ctx.fillText(item.title, index * cellWidth + padding, cellHeight / 2);
    });
    // 绘制表头内容
    for (let i = startRow; i < startRow + visibleRows; i++) {
        const item = tableData.dataSource[i];
        if (!item) return; // 没有匹配数据。
        for (let j = 0; j < tableData.column.length; j++) {
            const col = tableData.column[j];
            if (selectedCell.row === i && selectedCell.col === j) {
                ctx.fillStyle = randomColor();
                ctx.fillRect(j * cellWidth, cellHeight * (i - startRow + 1), cellWidth, cellHeight);
            }
            ctx.font = "32px serif";
            ctx.fillStyle = 'black';
            ctx.fillText(item[col.dataIndex], j * cellWidth + padding, cellHeight * (i - startRow + 1) + (cellHeight / 2));
        }

    }
}

const handleWheel = () => {
    document.addEventListener('wheel', throttle((ev) => {
        const { deltaY } = ev;
        // 边界问题。然后加上一下防抖和节流TODO
        if (deltaY < 0 && startRow > 0) {
            --startRow;
            drawTables();
        } else if (deltaY > 0 && startRow + visibleRows < tableData.dataSource.length) {
            ++startRow;
            drawTables();
        }
    }, 100), false);
}
const handleSearch = (ev) => {
    console.log(ev.target.value);
    tableData.dataSource = tableData.tempDataSource.filter(item => item.name.indexOf(ev.target.value) > -1);
    // console.log(tableData.dataSource, 'tableData.dataSource ');
    // drawTables();
}
watch(
    () => tableData.dataSource,
    () => drawTables(),
)
onMounted(() => {
    canvasRef.addEventListener('click', handleClick);
    drawTables();
    handleWheel();
})
onUnmounted(() => {
    // 移除监听事件。
    canvasRef?.removeEventListener('click', handleClick);
})
</script>

<style  scoped>
.wrapper {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: auto;
}

input {
    width: 80%;

}

#canvas {
    border: 1px solid #ccc;
    width: 800px;
    height: 600px;
}
</style>