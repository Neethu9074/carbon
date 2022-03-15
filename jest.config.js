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

  transformIgnorePatterns: [
    '.jest/register-context.js',
    'node_modules/jest-runner/build/runTest.js',
    'node_modules/.*',
    '/node_modules/jest-runner/build/index.js'
  ],
  moduleNameMapper: {
    '\\.png$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.less$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.mless$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.css$': '<rootDir>/packages/in-test/styleMock.js',
    '\\.scss$': '<rootDir>/packages/in-test/styleMock.js'
  }
};
