module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: '2018',
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: 'airbnb',
  plugins: ['html'],
  // wechat globals
  globals: {
    // true to allow the variable to be overwritten or false to disallow overwriting
    getApp: false,
    Flimi: false,
    wx: false,
    App: false,
    Page: false,
    Component: false,
    getCurrentPages: false,
    Behavior: false,
  },
  settings: {
    'html/html-extensions': ['.html', '.wxml'],
  },
  // add your custom rules here
  rules: {
    'arrow-parens': 'off',
  },
};
