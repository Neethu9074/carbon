/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { applicationsList, isApplicationsView } from 'in-applications/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hasApplicationsAccess } from 'in-stores/permission';
import { t } from 'in-i18n';

export default function ApplicationsMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!hasApplicationsAccess) return null;

  return (
    <MenuItem
      id="main-nav-application"
      label={t('in-components:mainNavigation.viewSwitcherLabelApplications')}
      icon="lib_application_invert"
      isActive={matchLocation(isApplicationsView)}
      href={createHrefToPath(applicationsList)}
    />
  );
}
