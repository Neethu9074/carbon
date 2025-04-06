/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { MenuItem } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { getRootPathPredicate } from 'in-stores/navigation/paths';
import { t } from 'in-i18n';

export default function HomeLinkMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  const path = '/home';

  return (
    <MenuItem
      id="main-nav-system-overview"
      isActive={matchLocation(getRootPathPredicate(path))}
      icon="lib_home"
      href={createHrefToPath(path)}
      label={t('in-plg:home')}
    />
  );
}
