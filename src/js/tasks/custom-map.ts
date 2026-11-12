// Custom Map
(function () {
  'use strict';

  const customMap = (arr, fn) => {
    const result = [];
    for (let i = 0; i < arr.length; i++) result.push(fn(arr[i], i, arr));
    return result;
  };

  const arr = [1, 2, 3, 4];
  const arrCopy = JSON.stringify(arr);

  console.assert(
    JSON.stringify(customMap(arr, (x) => x * 2)) === JSON.stringify(arr.map((x) => x * 2)),
    'Map: results mismatch',
  );
  console.assert(JSON.stringify(arr) === arrCopy, 'Map: input mutated');
  console.assert(JSON.stringify(customMap([], (x) => x)) === '[]', 'Map: empty array failed');
  console.assert(
    JSON.stringify(customMap(['a', 'b'], (el, i) => el + i)) === '["a0","b1"]',
    'Map: index not passed',
  );

  console.log('Custom Map: OK');
})();
