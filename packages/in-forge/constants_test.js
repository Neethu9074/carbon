/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

// /* eslint-env mocha */

import { plugins, fullyQualifiedPlugins } from 'in-forge/constants';

describe('in-forge/constants', () => {
  describe('must translate short to long IDs', () => {
    Object.keys(plugins).forEach(key => {
      const shortPluginId = plugins[key];
      it(`must define a fully qualified plugin id for ${shortPluginId}`, () => {
        if (!fullyQualifiedPlugins[shortPluginId]) {
          throw new Error(`Missing fully qualified pluginId for short plugin ID ${shortPluginId} in constants file.`);
        }
      });
    });
  });
});
