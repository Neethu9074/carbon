/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env node */

const internalStoryLoader = require.context('../../packages', true, /\.story\.(js|ts|tsx|mdx)$/);

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
