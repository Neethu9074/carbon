/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

const operator = require('../../../src/services/resolvers/operator');

jest.mock('../../../src/services/resolvers/featureFlags', () => [
  {
    uiClientKey: 'willGetFilteredOut',
    instanaCtlKey: 'because.it.is.false',
    defaultValue: false
  },
  {
    uiClientKey: 'hardCodedDefault',
    instanaCtlKey: 'killerFeature',
    defaultValue: true
  },
  {
    uiClientKey: 'getsOverwrittenByConfig',
    instanaCtlKey: 'gets.overwritten.by.config',
    defaultValue: true
  }
]);

jest.mock('../../../src/serverConfig', () => {
  return {
    clientConfig: {
      featureFlags: {
        getsOverwrittenByConfig: false,
        additionalFlag: true
      }
    }
  };
});

describe('in-server/services/resolvers/operator', () => {
  describe('getFeatureFlags', () => {
    it('should overwrite default.', async () => {
      const flags = await operator.getFeatureFlags();
      expect(flags).toMatchInlineSnapshot(`
        {
          "additionalFlag": true,
          "getsOverwrittenByConfig": false,
          "hardCodedDefault": true,
        }
      `);
    });
  });
});
