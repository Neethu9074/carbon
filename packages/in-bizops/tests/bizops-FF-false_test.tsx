/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { hasBizOpsAccess, AreaPermissions, productAreaPermissions } from 'in-stores/permission';

jest.mock('in-services/featureFlags', () => ({
  get businessObservabilityEnabled() {
    return false;
  }
}));

describe('in-stores/permissions.ts', () => {
  it('Checks that there is NO BizOps access when the feature flag is disabled', () => {
    expect(hasBizOpsAccess).toBeFalsy();
    expect(AreaPermissions).toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).not.toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'Business Processes' })])
    );
  });
});
