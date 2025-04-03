/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { hasBizOpsAccess, AreaPermissions, productAreaPermissions } from 'in-stores/permission';

jest.mock('in-services/featureFlags', () => ({
  get businessObservabilityEnabled() {
    return true;
  }
}));

describe('in-stores/permissions.ts test', () => {
  it('Checks the BizOps area permission when the feature flag is set', () => {
    expect(hasBizOpsAccess).toBeTruthy();
    expect(AreaPermissions).toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'Business processes' })])
    );
  });
});
