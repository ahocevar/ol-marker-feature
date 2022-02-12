module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'import/extensions': ['error', { js: 'always' }],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'off',
    'prefer-object-spread': 'off',
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
  },
};
