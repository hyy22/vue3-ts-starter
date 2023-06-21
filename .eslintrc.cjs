module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'vue/no-duplicate-attributes': 'off',
    'vue/valid-v-for': 'off',
    'vue/multi-word-component-names': 'off', // 组件命名允许单个单词
    '@typescript-eslint/no-explicit-any': 'off', // ts允许any
    '@typescript-eslint/no-non-null-assertion': 'off', // ts允许非空断言
    '@typescript-eslint/ban-ts-comment': 'off', // ts允许通过注释禁用
  },
};
