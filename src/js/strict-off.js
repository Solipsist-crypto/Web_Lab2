(function () {
  const check = (label, fn) => {
    try {
      console.log(`[SLOPPY] ${label}:`, fn());
    } catch (e) {
      console.log(`[SLOPPY] ${label}: ${e.name}: ${e.message}`);
    }
  };
  // eslint-disable-next-line no-undef
  check('Undeclared assignment', () => {
    undeclaredVar2 = 10;
    return undeclaredVar2;
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
  check('Parse error: with', () => new Function('with (Math) return PI;')());
  check('Parse error: octal', () => new Function('return 010;')());
})();
