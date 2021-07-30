module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/recommended',
    'eslint:recommended'
  ],
  // required to lint *.vue files
  plugins: ['vue'],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'vue/no-v-html': 'off',
    'arrow-parens': 'off',
    'one-var': 'off',
    'prefer-promise-reject-errors': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multiline-html-element-content-newline': 'off',
    'generator-star-spacing': 'off',
    'arrow-parens': 'off',
    'one-var': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-trailing-spaces': 'error',
    'newline-before-return': 'off',
    'no-empty-pattern': 'off',
    'no-irregular-whitespace': ["error", { "skipComments": true }],
    'no-empty': ['error', { allowEmptyCatch: true }],
    'no-unused-vars': ['error', { args: 'all' }],
    semi: ['error', 'never'],
    indent: [
      'error',
      2,
      {
        ArrayExpression: 1,
        MemberExpression: 1,
        ObjectExpression: 1,
        ImportDeclaration: 1
      }
    ],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'always',
        asyncArrow: 'always'
      }
    ],
    'array-element-newline': [
      'error',
      {
        multiline: true,
        minItems: 3
      }
    ],
    'array-bracket-newline': [
      'error',
      {
        multiline: true,
        minItems: 2
      }
    ],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          consistent: true
        },
        ObjectPattern: {
          multiline: true,
          consistent: true
        },
        ImportDeclaration: {
          multiline: true,
          consistent: true,
          minProperties: 0
        }
      }
    ],
    // allow console.log during development only
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // allow debugger during development only
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',

    // VUE
    'vue/component-name-in-template-casing': ['error', 'kebab-case'],
    'vue/max-attributes-per-line': [
      'warn',
      {
        singleline: 1,
        multiline: {
          max: 5,
          allowFirstLine: false
        }
      }
    ],
    'vue/html-closing-bracket-newline': [
      'warn',
      {
        singleline: 'never',
        multiline: 'always'
      }
    ],
    'vue/script-indent': [
      'warn',
      2,
      {
        baseIndent: 0
      }
    ],
    'vue/html-indent': [
      'warn',
      2,
      {
        attribute: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
        baseIndent: 0
        // ignores: ['VAttribute']
      }
    ]
  }
}
