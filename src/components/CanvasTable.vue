<template>
    <div class="wrapper">
        <canvas id="canvas" ref="canvasRef" width="500" height="300"></canvas>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { tableData } from '../config/tableData.ts'


var canvasRef = ref < HTMLCanvasElement | null > (null)

/* 
    1、使用 canvas 绘制表头信息
    2、使用 canvas 绘制表结构信息。
*/
const padding = 10, cellWidth = 120, cellHeight = 50;
const drawTables = () => {
    const ctx = canvasRef.getContext('2d');


    // 绘制表头
    tableData.column.forEach((item, index) => {
        // 现在如何给他们指定大小，然后绘制边框。
        // TODO ???怎么把文字放在框框里面呢。。。。。？？？
        /* 
        先确定单元格子的大小，然后绘制每个单元格子的大小之后，再在里面填充字体。
        确定每个单元格为 100 * 50 的大小？。
        如何绘制的呢。从哪个地点开始绘制
        */
        ctx.font = "16px serif";
        // ctx.fillText(item.title, (index + 1) * cellWidth + padding, cellHeight);

        // ctx.strokeRect(x, y, cellWidth, cellHeight);
        ctx.strokeRect(10, 10, (index + 1) * cellWidth + padding, cellHeight);
    });
    // 绘制表头内容
    tableData.dataSource.forEach((item, index) => {
        tableData.column.forEach((col, i) => {
            // 现在如何给他们指定大小，然后绘制边框。
            // TODO ???怎么把文字放在框框里面呢。。。。。？？？
            ctx.strokeRect(10, cellHeight + 10, (i + 1) * cellWidth + padding, cellHeight * (index + 1));


            ctx.font = "16px serif";
            // fillText(text, x, y)
            ctx.fillText(item[col.dataIndex], (i + 1) * cellWidth - 50, cellHeight * (index + 1));
        });
    });
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
}

onMounted(() => {
    drawTables();
})
</script>

<style  scoped>
.wrapper {
    cellWidth: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

#canvas {
    border: 1px solid #ccc;
}
</style>