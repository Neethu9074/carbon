/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

jest.mock('../../src/serverConfig');

const { getBaseUrl } = require('../../src/services/sharedUrlUtils');
const serverConfig = require('../../src/serverConfig');

describe('in-server/src/services/sharedUrlUtils', () => {
  describe('getBaseUrl', () => {
    it('must resolve default url format', async () => {
      const urlFormat = '$unit-$tenant.$baseDomain';
      serverConfig.urlFormat = urlFormat;
      serverConfig.clientConfig = {
        urlFormat,
        tenantUnitDomainSuffix: 'instana.rocks'
      };

      const result = await getBaseUrl('acme', 'dev', serverConfig.clientConfig);
      expect(result).toEqual('https://dev-acme.instana.rocks');
    });

    it('must resolve custom url format', async () => {
      const urlFormat = '$baseDomain/$tenant/$unit';
      serverConfig.urlFormat = urlFormat;
      serverConfig.clientConfig = {
        urlFormat,
        tenantUnitDomainSuffix: 'instana.rocks'
      };

      const result = await getBaseUrl('acme', 'dev', serverConfig.clientConfig);
      expect(result).toEqual('https://instana.rocks/acme/dev');
    });
  });
});
