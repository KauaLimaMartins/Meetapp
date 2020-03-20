module.exports = {
  env: {
    commonjs: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  plugins: [
    'prettier',
  ],
  rules: {
    "prettier/prettier": ["error", {
      "endOfLine": "auto"
    }],
    "no-param-reassign": "off",
    "camelcase": 'off',
    "class-methods-use-this": 'off',
  },
};
