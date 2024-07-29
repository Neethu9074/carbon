/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { t } from '@instana/i18n-react';

import ProfileMenu from './ProfileMenu';

jest.mock('in-services/featureFlags', () => ({
  tenantSwitcherEnabled: true
}));

describe('ProfileMenu', () => {
  describe('when the tenant switcher feature flag is enabled', () => {
    it('renders a link to the tenant switcher page', () => {
      render(<ProfileMenu isSideNavExpanded onClickSideNavExpand={jest.fn()} />);

      expect(
        screen.getByLabelText(t('in-components:mainNavigation.profileMenu_switchUnitOrTenant'))
      ).toBeInTheDocument();
      expect(screen.getByText(t('in-components:mainNavigation.profileMenu_profileLink'))).toBeInTheDocument();
      expect(screen.getByText(t('in-components:mainNavigation.profileMenu_unitName_tenantName'))).toBeInTheDocument();
      expect(screen.getByText(t('in-components:mainNavigation.profileMenu_switchUnitOrTenant'))).toBeInTheDocument();
      expect(screen.getByText(t('in-components:mainNavigation.profileMenu_logOut'))).toBeInTheDocument();
    });
  });
});
