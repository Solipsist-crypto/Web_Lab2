// Custom Filter
(function () {
  'use strict';

  const customFilter = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (fn(arr[i], i, arr)) result.push(arr[i]);
    }
    return result;
  };

  const arr = [1, 2, 3, 4, 5, 6];
  const arrCopy = JSON.stringify(arr);
  const isEven = (x) => x % 2 === 0;

  console.assert(
    JSON.stringify(customFilter(arr, isEven)) === JSON.stringify(arr.filter(isEven)),
    'Filter: results mismatch',
  );
  console.assert(JSON.stringify(arr) === arrCopy, 'Filter: input mutated');
  console.assert(customFilter([1, 3, 5], isEven).length === 0, 'Filter: none passed');
  console.assert(customFilter([2, 4], isEven).length === 2, 'Filter: all passed');

  console.log('Custom Filter: OK');
})();
