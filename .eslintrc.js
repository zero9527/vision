module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', '@vue/typescript/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    '@typescript-eslint/no-use-before-define': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'import/named': 'off',
    'import/prefer-default-export': 'off',
    'no-plusplus': 'off',
    'no-trailing-spaces': 'off',
    'object-curly-newline': 'off',
  },
};
