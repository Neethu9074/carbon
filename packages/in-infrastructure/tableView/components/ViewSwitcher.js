/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { physicalTablePath, physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import { isInfraExploreView, defaultInfraExploreView } from 'in-infrastructure/navigation/paths';
import { infraExploreEnabled } from 'in-infrastructure/Explore/services/featureFlags';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import SearchBar from 'in-components/SearchBar';
import { any } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default connectTo(
  {
    isMapActive: any(isView(physicalPath), isView(containerPath)),
    isTableActive: isTableView('physical'),
    isInfraExploreActive: isInfraExploreView()
  },
  function InfrastructureViewSwitcher({
    isMapActive,
    isTableActive,
    isInfraExploreActive,
    showSearchBar = true,
    theme = themes.dark
  }) {
    const darkTheme = theme === themes.dark;
    return (
      <div className={locals.wrapper}>
        <SecondLevelNavigation darkTheme={darkTheme}>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = physicalPath))}
            label={t('in-infrastructure:tableView.map')}
            isActive={isMapActive}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = physicalTablePath))}
            label={t('in-infrastructure:tableView.comparisonTable')}
            isActive={isTableActive}
          />
          {infraExploreEnabled && (
            <SecondLevelNavigationItem
              href$={defaultInfraExploreView}
              label={t('in-infrastructure:tableView.entityExploreBeta')}
              isActive={isInfraExploreActive}
            />
          )}
        </SecondLevelNavigation>
        {showSearchBar && <SearchBar style={{ maxWidth: 'calc(100% - 12rem)' }} theme={theme} />}
      </div>
    );
  }
);
