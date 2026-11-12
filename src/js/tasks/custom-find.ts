// Custom Find
(function () {
    'use strict';

    const customFind = <T>(arr: T[], fn: (item: T, index: number, array: T[]) => boolean): T | undefined => {
        for (let i = 0; i < arr.length; i++) {
            if (fn(arr[i] as T, i, arr)) return arr[i];
        }
        return undefined;
    };

    const arr = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
    ];
    const arrCopy = JSON.stringify(arr);

    console.assert(
        JSON.stringify(customFind(arr, (x) => x.id === 2)) ===
            JSON.stringify(arr.find((x) => x.id === 2)),
        'Find: result mismatch',
    );
    console.assert(customFind(arr, (x) => x.id === 99) === undefined, 'Find: not found failed');
    console.assert(JSON.stringify(arr) === arrCopy, 'Find: input mutated');

    console.log('Custom Find: OK');
})();