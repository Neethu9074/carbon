/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import importPlugin from 'eslint-plugin-import';
import babelParser from '@babel/eslint-parser';
import prettier from 'eslint-config-prettier';
import pluginJest from 'eslint-plugin-jest';
import globals from 'globals';

import commonConfig from '@instana/eslint-config-commons';

import { createImportRestrictionRule } from './build/linting/restrictedImportRule.js';

export default [
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
        babelOptions: {
          parserOpts: {
            plugins: ['jsx'] // see https://github.com/babel/babel/issues/14546
          }
        }
      },
      sourceType: 'module',
      ecmaVersion: 2021,
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        __DEV__: false,
        __HOT_RELOAD__: false
      }
    }
  },
  ...commonConfig,
  {
    ignores: ['packages/in-map/lib', 'packages/history']
  },
  {
    settings: {
      react: {
        version: '17.0.2'
      },

      'import/resolver': ['webpack', 'typescript'],

      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      }
    }
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'off'
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
      '@typescript-eslint/no-extra-non-null-assertion': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-redeclare': 'off'
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      prettier
    },
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

      // turning off -- reporting false positives see: https://github.com/eslint/eslint/issues/17003
      'no-use-before-define': [
        'off',
        {
          functions: false,
          classes: false,
          variables: false
        }
      ],

      // eslint9 introduces stricter rules, should be reviewed in the future
      // https://jsw.ibm.com/browse/INSTA-16778
      'react/prop-types': 'off',
      'react/no-unknown-property': 'off',
      'react/no-children-prop': 'warn',
      'react/jsx-equals-spacing': 'off',
      'react/jsx-tag-spacing': 'off',
      'react/no-unused-prop-types': 'off',
      quotes: 'off',
      semi: 'off',
      'prefer-const': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'no-unused-vars': 'off',
      strict: 'warn',
      'no-console': 'warn'
    }
  },
  {
    files: ['**/*test*.{js,jsx,ts,tsx}'],
    plugins: { jest: pluginJest },
    rules: {
      ...pluginJest.configs['flat/recommended'].rules,
      'jest/no-test-prefixes': 'off',
      'jest/valid-title': 'off',
      'jest/no-done-callback': 'off',
      'jest/no-identical-title': 'off',
      'jest/no-conditional-expect': 'off',
      'jest/no-export': 'off',
      'jest/valid-expect': 'off',
      'jest/no-alias-methods': 'off',
      'jest/no-jasmine-globals': 'off',
      'jest/no-standalone-expect': 'off',
      'jest/valid-describe-callback': 'off',
      'jest/no-focused-tests': 'off',
      'jest/expect-expect': 'off',
      'jest/no-disabled-tests': 'off',
      'jest/no-commented-out-tests': 'off'
    }
  },
  // eslint-plugin-import config
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      import: importPlugin
    },
    rules: {
      'import/no-deprecated': 'warn',
      // prevent unresolved imports
      // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^@storybook'],
          // disable case sensitivity checks, because they cause false positives
          // and this class of errors should be mostly covered by git already
          caseSensitive: false
        }
      ],
      ...createImportRestrictionRule()
    }
  }
];
