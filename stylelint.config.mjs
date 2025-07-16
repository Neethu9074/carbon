/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

// @ts-check

import defineConfig from 'stylelint-define-config';

const config = defineConfig({
  extends: ['stylelint-config-recommended-less', 'stylelint-plugin-carbon-tokens/config/recommended'],

  plugins: ['stylelint-plugin-carbon-tokens'],

  customSyntax: 'postcss-less',

  reportNeedlessDisables: true,
  reportInvalidScopeDisables: true,
  reportDescriptionlessDisables: true,

  rules: {
    // Carbon plugin rules as warnings
    // for the moment disable them
    'carbon/type-use': [false, { severity: 'warning' }],
    'carbon/theme-use': [false, { severity: 'warning' }],
    'carbon/layout-use': [false, { severity: 'warning' }],
    'carbon/motion-duration-use': [false, { severity: 'warning' }],
    'carbon/motion-easing-use': [false, { severity: 'warning' }],

    // Formatting rules with warning severity
    // ignore this rule, because it would only add an empty line between @import statements
    'at-rule-empty-line-before': null,

    // ignore this rule, because sometimes, code contains empty line for manually formatting and structuring
    'declaration-empty-line-before': null,

    // Enforce kebab-case for class names (recommended default)
    // LATER it could be something like 'selector-class-pattern': ['^[a-z0-9\\-]+$', { severity: 'warning' }],
    //
    // Disabled, because it would be hard to find a common pattern in all the legacy code.
    'selector-class-pattern': null,

    // https://stylelint.io/user-guide/rules/selector-pseudo-class-no-unknown/
    'selector-pseudo-class-no-unknown': [
      'always',
      {
        ignorePseudoClasses: ['global', 'local'],
        severity: 'warning'
      }
    ],

    // https://stylelint.io/user-guide/rules/no-descending-specificity/
    'no-descending-specificity': [true, { severity: 'warning' }],

    // https://stylelint.io/user-guide/rules/declaration-block-no-duplicate-properties/
    'declaration-block-no-duplicate-properties': [true, { severity: 'warning' }],

    // https://stylelint.io/user-guide/rules/no-duplicate-selectors/
    'no-duplicate-selectors': [true, { severity: 'warning' }],

    // https://stylelint.io/user-guide/rules/block-no-empty/
    'block-no-empty': [true, { severity: 'warning' }]
  }
});

export default config;
