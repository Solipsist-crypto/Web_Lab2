(function () {
    'use strict';

    const check = (label: string, fn: () => any): void => {
        try {
            console.log(`[STRICT] ${label}:`, fn());
        } catch (e) {
            const err = e as Error;
            console.log(`[STRICT] ${label}: ${err.name}: ${err.message}`);
        }
    };

    // @ts-ignore
    check('Undeclared assignment', () => {
        // @ts-ignore
        undeclaredVar = 10;
        // @ts-ignore
        return undeclaredVar;
    });

    check('this in function', function (this: any) {
        return String(this);
    });

    const frozen = Object.freeze({ a: 1 });
    check('Frozen object write', () => {
        // @ts-ignore
        frozen.a = 2;
        return frozen.a;
    });

    check('delete prototype', () => {
        // @ts-ignore
        delete Object.prototype;
        return 'deleted';
    });

    check('Parse error: with', () => new Function('"use strict"; with (Math) return PI;')());
    check('Parse error: octal', () => new Function('"use strict"; return 010;')());
})();