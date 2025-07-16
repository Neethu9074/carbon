/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/* eslint-env node */

const path = require('path');

module.exports = {
  env: {
    test: {
      plugins: ['require-context-hook']
    }
  },
  plugins: [
    // Manually added to enforce throwIfClosureRequired
    [
      '@babel/plugin-transform-block-scoping',
      {
        // enabled only if we do not build storybook
        throwIfClosureRequired: process.env.STORYBOOK !== 'true'
      }
    ],
    ['transform-class-properties', { spec: false }],

    // Plugin should only be included when building the Storybook. In the regular
    // dev mode/production build it only adds extra bytes that nobody cares about.
    process.env.STORYBOOK === 'true' && ['react-docgen']
  ].filter(Boolean),
  presets: [
    '@babel/preset-typescript',
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
        // Use more efficient transforms
        loose: true,
        // Set to true to see what kind of presets we are using.
        debug: false,

        exclude: [
          // excluded so that we can manual include it again with different options
          'transform-block-scoping',

          // Excluded because automatically added by preset-env and unused by our code.
          // Removed to speed up the build process
          'transform-new-target',
          'transform-regenerator',
          'transform-exponentiation-operator',
          'transform-async-to-generator',
          'proposal-async-generator-functions',
          'proposal-unicode-property-regex',
          'proposal-optional-catch-binding',
          'transform-named-capturing-groups-regex'
        ]
      }
    ]
  ],
  only: [
    // All our main packages
    path.join(__dirname, 'packages', '**', '*.js'),
    path.join(__dirname, 'packages', '**', '*.jsx'),
    path.join(__dirname, 'packages', '**', '*.ts'),
    path.join(__dirname, 'packages', '**', '*.tsx'),
    // Storybook
    path.join(__dirname, 'storybook', 'config', '**', '*.js'),
    path.join(__dirname, 'packages', '**', '*.mdx'),

    // Note that we deliberately do not transpile everything under node_modules. This is not
    // forbidden per se, but we should allow this on a case-by-case basis for performance reasons.

    // Explicitly enable transpilation of @instana/types, because it purely consists of automatically generated typescript
    // code that can't easily be transpiled upon creation
    path.join(__dirname, 'node_modules', '@instana', 'types', '**', '*.ts'),

    // Enable transpilation of @instana/ai-chat for ES modules support
    path.join(__dirname, 'node_modules', '@instana', 'ai-chat', '**', '*.js')
  ]
};
