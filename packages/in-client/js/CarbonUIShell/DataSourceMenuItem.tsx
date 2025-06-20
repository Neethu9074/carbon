/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import React from 'react';

import { MenuItem } from '@instana/components';

import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { agentsPath } from 'in-stores/navigation/paths/mainPaths';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function DataSourcesMenuItem() {
  const { matchLocation, createHrefToPath } = useNavigation();

  if (!role?.canConfigureAgents) return null;
  return (
    <MenuItem
      id="main-nav-agents"
      key="main-nav-agents"
      label={t('in-components:mainNavigation.viewSwitcherLabelDataSources')}
      icon="lib_datasource"
      href={createHrefToPath(agentsPath)}
      isActive={matchLocation(agentsPath)}
    />
  );
}
