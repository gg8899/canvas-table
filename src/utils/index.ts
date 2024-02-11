export const throttle = (func: Function, delay: number): Function => {
    // 节流的实现。
    let canCall = true;
    return function (this: any) {
        console.log(canCall, 'qqq');
        if (canCall) {
            func.apply(this, arguments);
            canCall = false;
            setTimeout(() => {
                canCall = true;
            }, delay);
        }
    }
};