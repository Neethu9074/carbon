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
    return true;
  }
}));

describe('in-stores/permissions.ts test', () => {
  it('Checks the BizOps area permission when the feature flag is set', () => {
    expect(hasBizOpsAccess).toBeTruthy();
    expect(AreaPermissions).toContain('ACCESS_BIZOPS');
    expect(productAreaPermissions).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: 'Business Processes' })])
    );
  });
});

describe('packages/in-components/MainNavigation/components/ViewSwitcher', () => {
  it('Checks the BizOps link is in the main navigation pane when the feature flag is set', () => {
    render(<ViewSwitcher />);
    screen.getByRole('link', { name: 'lib_navigation_home instana Inc.' });
    screen.getByRole('link', { name: 'lib_bizops' }).click();
  });
});
