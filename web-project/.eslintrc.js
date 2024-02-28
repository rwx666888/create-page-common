module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  globals: {
    arguments: true,
    $: true,
    _$cusComponents$_: true,
    _$cusConfig$_: true,
    process: true,
    __dirname: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        indent: 'error'
      }
    }
  ],
  rules: {
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
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
    // 单行属性最多4个，多个属性每行只能有1个
    'vue/max-attributes-per-line': [
      2,
      {
        singleline: 2,
        multiline: {
          max: 1,
          allowFirstLine: false
        }
      }
    ],
    // 不强制使用组件时是 PascalCase 还是 kebab-case, 默认强制使用 PascalCase
    'vue/component-name-in-template-casing': 0,
    // 不强制在单行元素前强制换行
    'vue/singleline-html-element-content-newline': 0,
    // 不强制在多行元素前强制换行
    'vue/multiline-html-element-content-newline': 0,
    'vue/no-v-html': 0,
    'eqeqeq': 1
  }
}
