/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import {
  hasBizOpsAccess,
  productPermissions,
  productPermissionsObject,
  Capability,
  AreaPermissions,
  productAreaPermissions
} from 'in-stores/permission';
// @ts-expect-error module need to be translated to TS
import ViewSwitcher from 'in-components/MainNavigation/components/ViewSwitcher/';

jest.mock('in-services/featureFlags', () => ({
  get businessObservabilityEnabled() {
    return false;
  }
}));

// jest.mock('in-services/featureFlags', () => ({
//   __esModule: true,
//   ...jest.requireActual('in-services/featureFlags')
// }));

describe('in-stores/permissions.ts', () => {
  // beforeEach(() => {
  //   jest.clearAllMocks();
  // });

  it('Checks the BizOps link is NOT in the main navigation pane when the feature flag is off', () => {
    // const featureFlags = jest.requireMock('in-services/featureFlags');
    // featureFlags.businessObservabilityEnabled = true;
    render(<ViewSwitcher />);
    screen.getByRole('link', { name: 'lib_navigation_stan instana Inc.' });
    expect(screen.queryByRole('link', { name: 'lib_bizops' })).toBeNull();
  });

  it('Checks the BizOps area permission when the feature flag is not set', () => {
    // const featureFlags = jest.requireMock('in-services/featureFlags');
    // featureFlags.businessObservabilityEnabled = true;
    expect(hasBizOpsAccess).toBeFalsy();
    expect(AreaPermissions).toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).not.toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'Business Processes' })])
    );
  });

  it('Checks the BizOps flag does not affect other permissions', () => {
    // const featureFlags = jest.requireMock('in-services/featureFlags');
    // featureFlags.businessObservabilityEnabled = false;
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_APPLICATIONS]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_VIEW_LOGS]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_CONFIGURE_MOBILE_APP_MONITORING]);
    expect(productPermissions).toContain(productPermissionsObject[Capability.CAN_INSTALL_NEW_AGENTS]);
  });
  it('Checks the BizOps capability permissions are NOT available to user when feature flag is not set', () => {
    // const featureFlags = jest.requireMock('in-services/featureFlags');
    // featureFlags.businessObservabilityEnabled = false;
    expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESSES]);
    expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_PROCESS_DETAILS]);
    expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BUSINESS_ACTIVITIES]);
    expect(productPermissions).not.toContain(productPermissionsObject[Capability.CAN_VIEW_BIZOPS_ALERTS]);
  });
});
