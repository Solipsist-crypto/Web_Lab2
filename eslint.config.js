import js from '@eslint/js';
import globals from 'globals';
import prettier from 'eslint-config-prettier/flat';

export default [
    {
        ignores: ['dist/', 'node_modules/'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.js'],
        languageOptions: {
            globals: globals.browser,
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            'no-unused-vars': 'warn',
            'no-console': 'off',
            'eqeqeq': 'error',
        },
    },
    prettier,
];