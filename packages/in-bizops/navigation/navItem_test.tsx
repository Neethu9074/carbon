/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

// @ts-expect-error module need to be translated to TS
import ViewSwitcher from 'in-components/MainNavigation/components/ViewSwitcher/';
jest.mock('in-services/featureFlags', () => ({
  get businessObservabilityEnabled() {
    return true;
  }
}));

describe('packages/in-components/MainNavigation/components/ViewSwitcher', () => {
  it('Checks the BizOps link is in the main avigation pane when the feature flag is set', () => {
    render(<ViewSwitcher />);
    screen.getByRole('link', { name: 'lib_navigation_stan instana Inc.' });
    screen.getByRole('link', { name: 'lib_bizops' }).click();
  });
});
