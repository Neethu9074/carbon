/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

jest.mock('../../src/serverConfig');

const { getBaseUrl } = require('in-server/src/services/instanaUrls');
const serverConfig = require('../../src/serverConfig');

describe('in-server/src/services/instanaUrls', () => {
  describe('getBaseUrl', () => {
    it('must resolve default url format', async () => {
      serverConfig.urlFormat = `$unit-$tenant.$baseDomain`;
      serverConfig.clientConfig = {
        tenantUnitDomainSuffix: 'instana.rocks'
      };

      const result = await getBaseUrl('acme', 'dev');
      expect(result).toEqual('https://dev-acme.instana.rocks');
    });

    it('must resolve custom url format', async () => {
      serverConfig.urlFormat = `$baseDomain/$tenant/$unit`;
      serverConfig.clientConfig = {
        tenantUnitDomainSuffix: 'instana.rocks'
      };

      const result = await getBaseUrl('acme', 'dev');
      expect(result).toEqual('https://instana.rocks/acme/dev');
    });
  });
});
