module.exports = {
    env: {
      node: true,
      commonjs: true,
      es6: true,
      jest: true
    },
    extends: [
      "airbnb-base",
      "plugin:import/errors",
      "plugin:import/warnings"
    ],
    globals: {
      Atomics: "readonly",
      SharedArrayBuffer: "readonly",
    },
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: "module",
    },
    rules: {
      "semi": ["error", "always"],
      "quotes": ["error", "double"],
      "linebreak-style" : 0
    },
    // eslint-disable-next-line no-dupe-keys
    "extends": "eslint:recommended"
  };
  