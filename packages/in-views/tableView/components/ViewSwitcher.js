import React from 'react';

import { physicalTablePath, physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { isInfraExploreView, infraExplorePath } from 'in-infrastructure/navigation/paths';
import { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { infrastructureExploreEnabled } from 'in-services/featureFlags';
import SearchBar from 'in-components/SearchBar';
import { any } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

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
            label="Map"
            isActive={isMapActive}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = physicalTablePath))}
            label="Comparison Table"
            isActive={isTableActive}
          />
          {infrastructureExploreEnabled && (
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = infraExplorePath))}
              label="Entity Explore (Beta)"
              isActive={isInfraExploreActive}
            />
          )}
        </SecondLevelNavigation>
        {showSearchBar && <SearchBar style={{ maxWidth: 'calc(100% - 12rem)' }} theme={theme} />}
      </div>
    );
  }
);
