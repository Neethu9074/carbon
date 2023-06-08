/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render } from '@testing-library/react';
import React from 'react';

import ViewSwitcher from 'in-components/MainNavigation/components/ViewSwitcher';
jest.mock('in-services/featureFlags', () => ({
  get playwithEnabled() {
    return true;
  }
}));

describe('demo/PlayWithHeader.tsx', () => {
  it('Checks the UI, Restricted menu are hided', () => {
    const result = render(<ViewSwitcher />);
    expect(result.container.querySelector('#main-nav-settings')).toBeFalsy();
    expect(result.container.querySelector('#main-nav-openstack')).toBeFalsy();
    expect(result.container.querySelector('#main-nav-more')).toBeFalsy();
    expect(result.container.querySelector('#main-nav-tenants')).toBeFalsy();
  });
});
