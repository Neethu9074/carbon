import React from 'react';

import { physicalTablePath, physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import SearchBar from 'in-components/SearchBar';
import { any } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

import locals from './ViewSwitcher.mless';

export default connectTo(
  {
    isMapActive: any(isView(physicalPath), isView(containerPath)),
    isTableActive: isTableView('physical')
  },
  function InfrastructureViewSwitcher({ isMapActive, isTableActive }) {
    return (
      <div className={locals.wrapper}>
        <SecondLevelNavigation darkTheme>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = physicalPath))}
            label="Map"
            isActive={isMapActive}
            darkTheme
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = physicalTablePath))}
            label="Comparison Table"
            isActive={isTableActive}
            darkTheme
          />
        </SecondLevelNavigation>

        <SearchBar theme="dark" />
      </div>
    );
  }
);
