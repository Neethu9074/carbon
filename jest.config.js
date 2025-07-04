/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest, node */

module.exports = {
  coverageDirectory: 'coverage',
  roots: ['packages'],
  testEnvironment: 'jsdom',
  globalSetup: '<rootDir>/packages/in-test/globalSetup.js',
  setupFilesAfterEnv: ['<rootDir>/packages/in-test/setup.js'],
  testMatch: ['**/*_test.js', '**/*_test.ts', '**/*_test.tsx'],
  fakeTimers: {
    enableGlobally: false
  },
  snapshotFormat: {
    escapeString: true,
    printBasicPrototype: true
  },
  transformIgnorePatterns: [
    '.jest/register-context.js',
    'node_modules/jest-runner/build/runTest.js',
    'node_modules/(?!(@instana/types|@instana/ai-chat)/)', // Enable both @instana/types and @instana/ai-chat to be transformed
    '/node_modules/jest-runner/build/index.js'
  ],
  transform: {
    '\\.[t|j]sx?$': 'babel-jest',
    '\\.grammar$': '<rootDir>/packages/in-test/grammarTransformer.js',
    '\\.svg$': '<rootDir>/packages/in-test/svgTransform.js'
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx', 'd.ts', 'json', 'node'],
  moduleNameMapper: {
    '\\.png$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.less$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.mless$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.css$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.yaml$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.scss$': '<rootDir>/packages/in-test/styleMock.js',
    '^promise-loader?(.*)!(.*)': '$2',
    'd3-(.*)': '<rootDir>/node_modules/d3-$1/dist/d3-$1.min.js',
    '\\.svg': '<rootDir>/packages/in-test/svgMock.ts'
  }
};
