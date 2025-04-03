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
      serverConfig.urlFormatPathStyle = false;
      serverConfig.clientConfig = {
        urlFormatPathStyle: false,
        tenantUnitDomainSuffix: 'instana.rocks'
      };

      const result = await getBaseUrl('acme', 'dev', serverConfig.clientConfig);
      expect(result).toEqual('https://dev-acme.instana.rocks');
    });

    it('must resolve custom url format', async () => {
      serverConfig.urlFormatPathStyle = true;
      serverConfig.clientConfig = {
        urlFormatPathStyle: true,
        tenantUnitDomainSuffix: 'instana.rocks'
      };

      const result = await getBaseUrl('acme', 'dev', serverConfig.clientConfig);
      expect(result).toEqual('https://instana.rocks/acme/dev');
    });
  });
});
