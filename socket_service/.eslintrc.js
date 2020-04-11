module.exports = {
    env: {
      browser: true,
      commonjs: true,
      es6: true,
    },
    extends: [
      'airbnb-base',
      'plugin:import/errors',
      'plugin:import/warnings'
    ],
    globals: {
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "linebreak-style" : 0
    },
    "extends": "eslint:recommended"
  };
  