/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */



const context = require.context('../in-forge/plugins', true, /\/[a-zA-Z0-9]+\.(js|ts|tsx)$/, 'lazy-once');

export async function getForgeComponent(path) {
  const loadModule = (path, extension) => {
    return context(`${path}.${extension}`)
      .then(result => result.default)
      .catch(() => undefined);
  };

  return (await loadModule(path, 'js')) || (await loadModule(path, 'ts')) || (await loadModule(path, 'tsx'));
}
