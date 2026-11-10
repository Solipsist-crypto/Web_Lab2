// Custom Flat
(function () {
  'use strict';

  const customFlat = (arr, depth = 1) => {
    const limit = depth === Infinity ? Number.MAX_SAFE_INTEGER : depth;
    const result = [];
    const walk = (input, d) => {
      for (const item of input) {
        if (Array.isArray(item) && d > 0) walk(item, d - 1);
        else result.push(item);
      }
    };
    walk(arr, limit);
    return result;
  };

  const arr = [1, [2, [3, [4]]]];
  const arrCopy = JSON.stringify(arr);

  console.assert(
    JSON.stringify(customFlat(arr, 1)) === JSON.stringify(arr.flat(1)),
    'Flat: depth 1',
  );
  console.assert(
    JSON.stringify(customFlat(arr, 2)) === JSON.stringify(arr.flat(2)),
    'Flat: depth 2',
  );
  console.assert(
    JSON.stringify(customFlat(arr, Infinity)) === JSON.stringify(arr.flat(Infinity)),
    'Flat: Infinity',
  );
  console.assert(JSON.stringify(arr) === arrCopy, 'Flat: input mutated');

  console.log('Custom Flat: OK');
})();
