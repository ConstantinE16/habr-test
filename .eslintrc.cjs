require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-airbnb-with-typescript',
  ],
  parser: 'vue-eslint-parser',
  rules: {
    semi: [ 'error', 'never' ],
    '@typescript-eslint/semi': [ 'error', 'never' ],
    '@typescript-eslint/brace-style': [ 'error', 'stroustrup' ],
    'brace-style': [ 'error', 'stroustrup' ],
    'vue/max-len': [ 'error', 140, {
      ignoreHTMLAttributeValues: true, // for d attribute in <path> of <svg>
    }],
    'array-bracket-spacing': [ 'error', 'always', {
      singleValue: true,
      objectsInArrays: false,
      arraysInArrays: false,
    }],
    // off
    'no-eval': 'off',
    'import/prefer-default-export': 'off',
    'no-param-reassign': 'off',
    'no-return-assign': 'off',
    'max-classes-per-file': 'off',
    'import/no-extraneous-dependencies': 'off',
    'class-methods-use-this': 'off',
    'import/order': 'off',
    'no-mixed-operators': 'off',
    'vue/multi-word-component-names': 'off',
    'vuejs-accessibility/form-control-has-label': 'off',
    'vuejs-accessibility/click-events-have-key-events': 'off',
    'no-plusplus': 'off',
  },
}
