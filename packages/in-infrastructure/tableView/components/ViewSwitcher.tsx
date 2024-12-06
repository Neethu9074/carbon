/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { PreviewPill, SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  physicalTablePath,
  physicalPath,
  containerPath,
  isTableView,
  infraSmartAlerts,
  infraAlertDetailsFullyQualifiedPath,
  graphExplorerPath
} from 'in-stores/navigation/paths/mainPaths';
import { isInternalVisible$ } from 'in-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
import { graphTabEnabled, infraSmartAlertsEnabled } from 'in-services/featureFlags';
import { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import SearchBar from 'in-components/SearchBar';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function InfrastructureViewSwitcher({ showSearchBar = true, theme = themes.dark }) {
  const { matchLocation, createHrefToPath } = useNavigation();

  const isMapActive = matchLocation(physicalPath) || matchLocation(containerPath);
  const isAlertActive = matchLocation(infraSmartAlerts) || matchLocation(infraAlertDetailsFullyQualifiedPath);
  const isTableActive = useObservable(isTableView('physical'), []);

  const darkTheme = theme === themes.dark;
  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation darkTheme={darkTheme}>
        <SecondLevelNavigationItem
          href={createHrefToPath(physicalPath)}
          label={t('in-infrastructure:tableView.map')}
          isActive={isMapActive}
        />
        <SecondLevelNavigationItem
          href={createHrefToPath(physicalTablePath)}
          label={t('in-infrastructure:tableView.comparisonTable')}
          isActive={isTableActive === null ? undefined : isAlertActive}
        />
        {infraSmartAlertsEnabled && !role?.limitedInfrastructureScope && (
          <SecondLevelNavigationItem
            href={createHrefToPath(infraSmartAlerts)}
            label={
              <>
                {t('in-infrastructure:tableView.smartAlerts')}
                <PreviewPill className={locals.betaPill} />
              </>
            }
            isActive={isAlertActive}
          />
        )}
        <GraphTab />
      </SecondLevelNavigation>
      {showSearchBar && !isAlertActive && <SearchBar style={{ maxWidth: 'calc(100% - 12rem)' }} theme={theme} />}
    </div>
  );
}

function GraphTab() {
  const isInternalVisible = useObservable(isInternalVisible$, [isInternalVisible$]);
  const { matchLocation, createHrefToPath } = useNavigation();
  const isGraphActive = matchLocation(graphExplorerPath);

  if (!isInternalVisible || !graphTabEnabled) {
    return null;
  }

  return (
    <SecondLevelNavigationItem
      href={createHrefToPath(graphExplorerPath)}
      label={t('in-infrastructure:tableView.graph')}
      isActive={isGraphActive}
    />
  );
}
