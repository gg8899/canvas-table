<template>
    <div class="wrapper">
        <input type="text" @input="handleSearch">
        <canvas id="canvas" ref="canvasRef" width="1600" height="1200"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref, onUnmounted, reactive, watch } from "vue";
import { tableDataData } from '../config/tableData.ts'


let canvasRef = ref < HTMLCanvasElement | null > (null);
const selectedCell = reactive({ row: 0, col: 0 }); // 被选中的单元格。
const pixelRatio = window.devicePixelRatio;
const tableData = reactive({
    ...tableDataData,
    tempDataSource: tableDataData.dataSource,
});
/* 
    1、使用 canvas 绘制表头信息
    2、使用 canvas 绘制表结构信息。
*/
const padding = 50, cellWidth = 100 * pixelRatio, cellHeight = 50 * pixelRatio;

// 可视区域的第一行是
let startRow = 0;

// 可视区域有多少行
const visibleRows = Math.ceil(1200 / cellHeight) - 1;

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
        // 现在如何给他们指定大小，然后绘制边框。
        // TODO ???怎么把文字放在框框里面呢。。。。。？？？
        /* 
        先确定单元格子的大小，然后绘制每个单元格子的大小之后，再在里面填充字体。
        确定每个单元格为 100 * 50 的大小？。
        如何绘制的呢。从哪个地点开始绘制
        */

        ctx.font = "32px serif";
        ctx.fillText(item.title, index * cellWidth + padding, cellHeight / 2);
    });
    // 绘制表头内容
    /* tableData.dataSource.forEach((item, index) => {
        tableData.column.forEach((col, i) => {
            // 现在如何给他们指定大小，然后绘制边框。
            // TODO ???怎么把文字放在框框里面呢。。。。。？？？
            // ctx.strokeRect(10, cellHeight + 10, (i + 1) * cellWidth + padding, cellHeight * (index + 1));
            // ctx.font = "16px serif";
            // // fillText(text, x, y)
            // ctx.fillText(item[col.dataIndex], (i + 1) * cellWidth - 50, cellHeight * (index + 1));

            if (selectedCell.row === index && selectedCell.col === i) {
                ctx.fillStyle = randomColor();
                ctx.fillRect(i * cellWidth, cellHeight * (index + 1), cellWidth, cellHeight);
            }
            ctx.font = "32px serif";
            ctx.fillStyle = 'black';
            ctx.fillText(item[col.dataIndex], i * cellWidth + padding, cellHeight * (index + 1) + (cellHeight / 2));
        });
    }); */

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
    // 如何绘制表格的大小，然后在里面填充大小的呢情况。
    // 感觉表格的大小还没确定好。不知道怎么处理比较好。
    /*  TODO
        1、将文字刚好填充再里面？
        2、点击给她绘制背景色。
        3、可以实现滚动加载大量的数据
        4、其他。。暂时没想到。
    */
    /* 
     查了一下资料，是用划线来处理的。
    */

    /* 
     然后如何处理自适应表头信息。
     还有像素比列的问题处理。进行比列缩放。
    */

    /* 
     思路重新整理：
     1、通过处理像素比列之后，通过计算画布大小。绘制出当前的画布可视区域能够最多展示多少列的数据。
     Math.floor() 进行向下取整。
 
     绘制垂直和水平方向的横线。
     TODO：question，如果内容过大怎么办。如何实现自适应的表格内容绘制呢。
     
     2、进行监听鼠标滚动事件wheel，通过滚动的距离，计算当前页面展示的是哪一条table数据。
 
 
     3、实现判断点击，是在哪一个单元格子，然后将内容进行整个填充随机背景色。
 
 
 
     其他知识点：
     1、分层canvas的实现。
 
     应用：实现电子表格。（通过操作dom难以实现，性能非常差）
 
 
     
 
 
 
 
    
    */
}

const handleWheel = () => {
    document.addEventListener('wheel', (ev) => {
        const { deltaY } = ev;
        // 边界问题。然后加上一下防抖和节流TODO
        if (deltaY < 0 && startRow > 0) {
            --startRow;
            drawTables();
        } else if (deltaY > 0 && startRow + visibleRows < tableData.dataSource.length) {
            ++startRow;
            drawTables();
        }
    }, false);
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