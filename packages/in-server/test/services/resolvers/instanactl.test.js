/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

// eslint-disable-next-line no-unused-vars
const { Pool } = require('pg');
const instanactl = require('../../../src/services/resolvers/instanactl');

/* eslint-env jest */

jest.mock('../../../src/services/resolvers/featureFlags', () => [
  {
    uiClientKey: 'simpleBooleanToggle',
    instanaCtlKey: 'feature.simpleBooleanToggle',
    defaultValue: false
  },
  {
    uiClientKey: 'tenantUnitFlagForSharedComponentSingleTU',
    instanaCtlKey: 'feature.shared.singleTU',
    defaultValue: false
  }
]);

const mockFlags = new Map();

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    query: ({ values }) => {
      const flag = mockFlags.get(values[0]);
      return Promise.resolve({
        rows: [flag].filter(Boolean)
      });
    }
  }))
}));
jest.mock('../../../src/services/reportingEndpoints');
jest.mock('../../../src/serverConfig');
jest.mock('../../../src/services/loadingCache', () => ({
  createLoadingCache: () => jest.fn().mockImplementation((key, loader) => loader())
}));

function setupMockFlag(scope, key, value) {
  mockFlags.set(key, { scope, value });
}

describe('in-server/services/resolvers/instanactl', () => {
  describe('getFeatureFlags', () => {
    const tenant = 'instana';
    const unit = 'stansLab';

    beforeEach(() => {
      mockFlags.clear();
    });

    it('parses missing simple boolean toggle correctly', async () => {
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['simpleBooleanToggle']).toBeFalsy();
    });

    it('parses enabled simple boolean toggle correctly', async () => {
      setupMockFlag('tenantUnit', 'feature.simpleBooleanToggle', 'true');
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['simpleBooleanToggle']).toBeTruthy();
    });

    it('parses disabled simple boolean toggle correctly', async () => {
      setupMockFlag('tenantUnit', 'feature.simpleBooleanToggle', 'false');
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['simpleBooleanToggle']).toBeFalsy();
    });

    it('parses missing tenant unit flag for shared component correctly', async () => {
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['tenantUnitFlagForSharedComponentSingleTU']).toBeFalsy();
    });

    it('parses wildcard tenant unit flag for shared component correctly', async () => {
      setupMockFlag('deployment', 'feature.shared.singleTU', '*');
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['tenantUnitFlagForSharedComponentSingleTU']).toBeTruthy();
    });

    it('parses tenant unit flag for shared component with current TU enabled correctly', async () => {
      setupMockFlag('deployment', 'feature.shared.singleTU', `${tenant}-${unit}`);
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['tenantUnitFlagForSharedComponentSingleTU']).toBeTruthy();
    });

    it('parses tenant unit flag for shared component with different TU enabled correctly', async () => {
      setupMockFlag('deployment', 'feature.shared.singleTU', `${tenant}-demo`);
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['tenantUnitFlagForSharedComponentSingleTU']).toBeFalsy();
    });

    it('parses tenant unit flag for shared component with multiple TU enabled correctly', async () => {
      setupMockFlag('deployment', 'feature.shared.singleTU', `${tenant}-demo,${tenant}-${unit}`);
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['tenantUnitFlagForSharedComponentSingleTU']).toBeTruthy();
    });

    it('avoids partial matches when parsing a tenant unit flag for shared component', async () => {
      setupMockFlag('deployment', 'feature.shared.singleTU', `${tenant}-${unit}Testing, ${tenant}-demo`);
      const flags = await instanactl.getFeatureFlags(tenant, unit);
      expect(flags['tenantUnitFlagForSharedComponentSingleTU']).toBeFalsy();
    });
  });
});
