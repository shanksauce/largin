module.exports = {
  rules: {
    'arrow-parens': 'error',
    'comma-dangle': 'error',
    'eqeqeq': 'error',
    'keyword-spacing': 'error',
    'max-len': ['error', 80],
    'no-trailing-spaces': 'error',
    'no-undef': 'error',
    'no-unused-vars': 'warn',
    'no-var': 'error',
    'operator-linebreak': ['error', 'after'],
    'semi': 'error',
    'space-infix-ops': 'error',
    'indent': ['error', 2, {
      'ArrayExpression': 1,
      'ObjectExpression': 1,
      'SwitchCase': 1,
      'MemberExpression': 1,
      'flatTernaryExpressions': true
    }],
    'quotes': ['error', 'single', {
      'allowTemplateLiterals': true
    }],
    'space-before-function-paren': ['error', {
      'anonymous': 'never',
      'named': 'never',
      'asyncArrow': 'always'
    }]
  },
  env: {
    'node': true,
    'mocha': true,
    'es6': true
  },
  parserOptions: {
    sourceType: 'module',
		ecmaVersion: 9,
    ecmaFeatures: {
      impliedStrict: true
    }
  }
};
