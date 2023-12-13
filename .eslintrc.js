/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

const { createImportRestrictionRule } = require('./build/linting/restrictedImportRule');

module.exports = {
  parserOptions: {
    babelOptions: {
      configFile: __dirname + '/babel.config.js'
    }
  },

  extends: ['@instana/eslint-config-commons', 'eslint:recommended', 'prettier', 'plugin:react-hooks/recommended'],

  plugins: ['react', 'jest', 'babel', 'header', 'import'],

  settings: {
    react: {
      version: '17.0.2'
    },
    'import/resolver': ['webpack', 'typescript'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    }
  },

  globals: (function () {
    let globals = require('globals').browser;
    delete globals['name'];
    delete globals['Notification'];
    delete globals['find'];
    delete globals['open'];
    delete globals['close'];
    delete globals['focus'];
    globals.Promise = false;
    globals.__DEV__ = false;
    globals.__HOT_RELOAD__ = false;
    return globals;
  })(),

  rules: {
    /**
     * With the latest eslint upgrade, this rule fails on many places, even on working code.
     * While it is only an issue with react in developer mode - we can disable it, but
     * need to investigate and fix the places it reports.
     * See Kanban Card 148861:
     * https://instana.kanbanize.com/ctrl_board/103/cards/148861
     */
    'react/display-name': 'off',

    // prevent from throwing no-unused-expression error when using optional chaining
    'no-unused-expressions': 'off',
    'babel/no-unused-expressions': ['error'],

    // prevent unresolved imports
    // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
    // eslint-disable-next-line no-useless-escape
    'import/no-unresolved': [
      'error',
      {
        ignore: ['^@storybook'],
        // disable case sensitivity checks, because they cause false positives
        // and this class of errors should be mostly covered by git already
        caseSensitive: false
      }
    ],

    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
        variables: false
      }
    ],

    ...createImportRestrictionRule()
  },
  overrides: [
    {
      files: ['packages/**/*_test.js', 'packages/**/*_test.ts?(x)'],
      extends: '@instana/eslint-config-commons/overrides/jest'
    },
    {
      files: ['packages/**/*.ts?(x)'],
      extends: '@instana/eslint-config-commons/overrides/typescript'
    }
  ]
};
