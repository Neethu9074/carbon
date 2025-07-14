/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItemWithExternalLink } from 'in-client/js/CarbonUIShell/MenuItemWithExternalLink';
import { t } from 'in-i18n';

/**
 * temporary component, as requested while solis qa testing in July - will be removed for September solis release
 */
export default function SoftwareCatalogMenuItem() {
  return (
    <MenuItemWithExternalLink
      id="main-nav-catalog"
      key="main-nav-catalog"
      icon="lib_actions_catalog"
      label={t('in-components:mainNavigation.viewSwitcherLabelSoftwareCatalog')}
      href="https://catalog.test.saas.ibm.com/search"
    />
  );
}
