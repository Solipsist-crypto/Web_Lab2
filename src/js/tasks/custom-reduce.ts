// Custom Reduce
(function () {
    'use strict';

    const customReduce = <T, U>(
        arr: T[],
        fn: (acc: U, item: T, index: number, array: T[]) => U,
        initialValue: U,
    ): U => {
        let acc = initialValue;
        for (let i = 0; i < arr.length; i++) acc = fn(acc, arr[i] as T, i, arr);
        return acc;
    };

    const arr = [1, 2, 3, 4];
    const arrCopy = JSON.stringify(arr);
    const sum = (acc: number, val: number) => acc + val;

    console.assert(customReduce(arr, sum, 0) === arr.reduce(sum, 0), 'Reduce: init 0 mismatch');
    console.assert(customReduce(arr, sum, 10) === arr.reduce(sum, 10), 'Reduce: init 10 mismatch');
    console.assert(JSON.stringify(arr) === arrCopy, 'Reduce: input mutated');
    console.assert(customReduce([], sum, 5) === 5, 'Reduce: empty array failed');

    console.log('Custom Reduce: OK');
})();