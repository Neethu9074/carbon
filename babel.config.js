/* eslint-env node */

const path = require('path');

module.exports = {
  plugins: [
    // Manually added to enforce throwIfClosureRequired
    [
      '@babel/plugin-transform-block-scoping',
      {
        throwIfClosureRequired: true
      }
    ],
    ['transform-class-properties', { spec: false }],

    // Plugin should only be included when building the Storybook. In the regular
    // dev mode/production build it only adds extra bytes that nobody cares about.
    process.env.STORYBOOK === 'true' && ['react-docgen']
  ].filter(Boolean),
  presets: [
    '@babel/preset-flow',
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
    // Storybook
    path.join(__dirname, 'storybook', '**', '*.js'),
    path.join(__dirname, 'storybook', '**', '*.mdx')
    // Note that we deliberately do not transpile everything under node_modules. This is not
    // forbidden per se, but we should allow this on a case-by-case basis.
  ]
};
