(function () {
  'use strict';
  /* eslint-disable no-undef */
  const check = (label, fn) => {
    try {
      console.log(`[STRICT] ${label}:`, fn());
    } catch (e) {
      console.log(`[STRICT] ${label}: ${e.name}: ${e.message}`);
    }
  };

  check('Undeclared assignment', () => {
    undeclaredVar = 10;
    return undeclaredVar;
  });
  check('this in function', function () {
    return String(this);
  });
  const frozen = Object.freeze({ a: 1 });
  check('Frozen object write', () => {
    frozen.a = 2;
    return frozen.a;
  });
  check('delete prototype', () => {
    delete Object.prototype;
    return 'deleted';
  });
  check('Parse error: with', () => new Function('"use strict"; with (Math) return PI;')());
  check('Parse error: octal', () => new Function('"use strict"; return 010;')());
})();
/* eslint-enable no-undef */
