(function () {
    const check = (label: string, fn: () => any): void => {
        try {
            console.log(`[SLOPPY] ${label}:`, fn());
        } catch (e) {
            const err = e as Error;
            console.log(`[SLOPPY] ${label}: ${err.name}: ${err.message}`);
        }
    };

    // @ts-ignore
    check('Undeclared assignment', () => {
        // @ts-ignore
        undeclaredVar2 = 10;
        // @ts-ignore
        return undeclaredVar2;
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

    check('Parse error: with', () => new Function('with (Math) return PI;')());
    check('Parse error: octal', () => new Function('return 010;')());
})();