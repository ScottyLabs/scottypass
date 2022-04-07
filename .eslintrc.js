/* eslint-disable */

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser', // Specifies the ESLint parser
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 'latest', // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    project: './tsconfig.json',
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true }],
    'comma-dangle': 2,
    'no-extra-semi': 2,
    'no-irregular-whitespace': 2,
    'no-lonely-if': 2,
    'no-multi-spaces': 2,
    'no-multiple-empty-lines': 1,
    'no-trailing-spaces': 2,
    'no-unexpected-multiline': 2,
    'no-unreachable': 'error',
    'object-curly-spacing': ['error', 'always'],
    semi: 2,
  },
  ignorePatterns: ['.eslintrc.js'],
};
