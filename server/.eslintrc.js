module.exports = {
  'root': true,
  'env': {
    'browser': true,
    'commonjs': true,
    'node': true
  },
  'extends': [ 'eslint:recommended', 'plugin:node/recommended' ],
  'parserOptions': {
    'ecmaVersion': 2020,
  },
  'rules': {
    'no-console': 'off',
    'indent': [ 'error',2 ],
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'array-bracket-spacing': [ 'error', 'always' ],
    // 引号，在js里使用单引号 或 模板字符串包裹字符串 https://eslint.org/docs/rules/quotes#top
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    // 语句后面不加分号 https://eslint.org/docs/rules/semi#top
    semi: [
      2,
      'never',
      {
        beforeStatementContinuationChars: 'never'
      }
    ],
    // 禁止使用 delete 关键字删除变量
    'no-delete-var': 2,
    // 标记使用 let 声明，但在初始化赋值后从未被修改过的变量，建议换成 const 声明
    'prefer-const': [
      2,
      {
        ignoreReadBeforeAssign: false
      }
    ],

    'eqeqeq': 1
  }
}
