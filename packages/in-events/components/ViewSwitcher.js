import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import { eventsPath } from 'in-events/navigation/paths';
import SearchBar from 'in-components/SearchBar';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher({ selectedEventType }) {
  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', null))}
          label="All"
          isActive={!selectedEventType}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', 'incident'))}
          label="Incidents"
          isActive={selectedEventType === 'incident'}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', 'issue'))}
          label="Issues"
          isActive={selectedEventType === 'issue'}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, eventsPath, 'view', 'change'))}
          label="Changes"
          isActive={selectedEventType === 'change'}
          darkTheme
        />
      </SecondLevelNavigation>

      <SearchBar style={{ maxWidth: 'calc(100% - 28rem)' }} theme="light" />
    </div>
  );
}
