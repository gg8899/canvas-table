const arr = [];
for (let i = 0; i < 1000; i++) {
    arr.push({
        key: i + 1,
        name: `Mui${i}`,
        age: Math.ceil(Math.random() * 100),
        address: '湖底公园',
    });
}

export const tableDataData = {
    column: [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '年龄',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: '住址',
            dataIndex: 'address',
            key: 'address',
        },
    ],
    dataSource: arr
}