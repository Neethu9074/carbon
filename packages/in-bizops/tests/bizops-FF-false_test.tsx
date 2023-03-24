/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

// @ts-expect-error module need to be translated to TS
import ViewSwitcher from 'in-components/MainNavigation/components/ViewSwitcher/';
import { hasBizOpsAccess, AreaPermissions, productAreaPermissions } from 'in-stores/permission';

jest.mock('in-services/featureFlags', () => ({
  get businessObservabilityEnabled() {
    return false;
  }
}));

describe('in-stores/permissions.ts', () => {
  it('Checks the BizOps area permission when the feature flag is not set', () => {
    expect(hasBizOpsAccess).toBeFalsy();
    expect(AreaPermissions).toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).not.toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'Business Processes' })])
    );
  });
});

describe('packages/in-components/MainNavigation/components/ViewSwitcher', () => {
  it('Checks the BizOps link is NOT in the main navigation pane when the feature flag is off', () => {
    render(<ViewSwitcher />);
    screen.getByRole('link', { name: 'lib_navigation_stan instana Inc.' });
    expect(screen.queryByRole('link', { name: 'lib_bizops' })).toBeNull();
  });
});
