/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  hasBizOpsAccess,
  productPermissions,
  productPermissionsObject,
  Capability,
  AreaPermissions,
  productAreaPermissions
} from 'in-stores/permission';

jest.mock('in-services/featureFlags', () => ({
  get businessObservabilityEnabled() {
    return true;
  }
}));

// jest.mock('in-services/featureFlags', () => ({
//   __esModule: true,
//   ...jest.requireActual('in-services/featureFlags')
// }));

describe('in-stores/permissions.ts test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Checks the BizOps area permission when the feature flag is set', () => {
    // const featureFlags = jest.requireMock('in-services/featureFlags');
    // featureFlags.businessObservabilityEnabled = true;
    expect(hasBizOpsAccess).toBeTruthy();
    expect(AreaPermissions).toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'Business Processes' })])
    );
  });

  it('Checks the BizOps flag does not affect other permissions', () => {
    // const featureFlags = jest.requireMock('in-services/featureFlags');
    // featureFlags.businessObservabilityEnabled = true;
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_APPLICATIONS]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_INSTALL_NEW_AGENTS]);
  });

  it('Checks the BizOps capability permissions are available to user when feature flag is set', () => {
    // const featureFlags = jest.requireMock('in-services/featureFlags');
    // featureFlags.businessObservabilityEnabled = true;
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESSES]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESS_DETAILS]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_ACTIVITIES]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_BIZOPS_ALERTS]);
  });
});
