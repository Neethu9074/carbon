/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

const { IS_TEST } = process.env;

const isTest = IS_TEST === 'true';

// mdx files are not properly supported in the current version of storybook-snapshots-addon,
// So they will be ignored when running yarn test:storybook (which sets IS_TEST=true)

const internalStoryLoader = isTest
  ? require.context('../../packages', true, /\.story\.(js|ts|tsx)$/)
  : require.context('../../packages', true, /\.story\.(js|ts|tsx|mdx)$/);

export function loadStory(id) {
  const storyExports = internalStoryLoader(id);
  const defaultExport = {
    ...(storyExports.default || {}),
    title: id
      .replaceAll(/^.\//gi, '')
      .replaceAll(/^in-/gi, '')
      .replaceAll(/\/stor(y|ies)\//gi, '/')
      .replaceAll(/\.story.*$/gi, '')
      .replaceAll(/^\/?([a-z-0-9]+)\/(.*)/gi, (match, p1, p2) => `${p1}/${p2}`)
  };
  return {
    ...storyExports,
    default: defaultExport
  };
}

loadStory.keys = (...args) => internalStoryLoader.keys(...args);
