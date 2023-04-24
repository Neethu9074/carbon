/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { physicalTablePath, physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import SearchBar from 'in-components/SearchBar';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function InfrastructureViewSwitcher({ showSearchBar = true, theme = themes.dark }) {
  const { matchLocation, createHrefToPath } = useNavigation();

  const isMapActive = matchLocation(physicalPath) || matchLocation(containerPath);
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
          isActive={isTableActive}
        />
      </SecondLevelNavigation>
      {showSearchBar && <SearchBar style={{ maxWidth: 'calc(100% - 12rem)' }} theme={theme} />}
    </div>
  );
}
