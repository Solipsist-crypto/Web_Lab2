// Custom deepClone
(function () {
    'use strict';

    const deepClone = <T>(src: T): T => {
        if (src === null || typeof src !== 'object') return src;
        if (src instanceof Date) return new Date(src.getTime()) as T;
        if (Array.isArray(src)) return src.map((item) => deepClone(item)) as T;
        if (src instanceof Map) {
            const m = new Map();
            src.forEach((v, k) => m.set(deepClone(k), deepClone(v)));
            return m as T;
        }
        if (src instanceof Set) {
            const s = new Set();
            src.forEach((v) => s.add(deepClone(v)));
            return s as T;
        }
        const out: Record<string, unknown> = {};
        for (const key in src) {
            if (Object.prototype.hasOwnProperty.call(src, key)) {
                out[key] = deepClone((src as Record<string, unknown>)[key]);
            }
        }
        return out as T;
    };

    const original = {
        name: 'Test',
        nested: { a: 1, b: [1, 2, 3] },
        date: new Date(2026, 0, 1),
    };
    const clone = deepClone(original);

    console.assert(clone !== original, 'Clone: reference copied');
    console.assert(clone.nested !== original.nested, 'Clone: nested reference copied');
    console.assert(clone.nested.b !== original.nested.b, 'Clone: array reference copied');
    console.assert(clone.date instanceof Date, 'Clone: date lost');

    clone.nested.a = 99;
    console.assert(original.nested.a === 1, 'Clone: mutated original');

    console.log('Custom deepClone: OK');
})();