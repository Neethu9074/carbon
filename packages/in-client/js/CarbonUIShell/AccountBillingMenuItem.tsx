/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { ampUsage } from 'in-settings/navigation/paths';
import { t } from 'in-i18n';

export default function AccountBillingMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  return (
    <MenuItem
      id="main-nav-account-billing"
      label={t('in-components:mainNavigation.viewSwitcherLabelAccountAndBilling')}
      icon="lib_account"
      isActive={matchLocation(ampUsage)}
      href={createHrefToPath(ampUsage)}
    />
  );
}
