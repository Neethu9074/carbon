import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';

import locals from './ViewSwitcher.mless';

// TODO: move to a proper file
const allEventsPath = '/events';

export default function InfrastructureViewSwitcher({ selectedEventType }) {
  return (
    <div className={locals.wrapper}>
      <SecondLevelNavigation darkTheme>
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, allEventsPath, 'view', null))}
          label="All"
          isActive={!selectedEventType}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, allEventsPath, 'view', 'incident'))}
          label="Incidents"
          isActive={selectedEventType === 'incident'}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, allEventsPath, 'view', 'issue'))}
          label="Issues"
          isActive={selectedEventType === 'issue'}
          darkTheme
        />
        <SecondLevelNavigationItem
          href$={getModifiedUrlStream(location => setOrDeleteMatrixKey(location, allEventsPath, 'view', 'change'))}
          label="Changes"
          isActive={selectedEventType === 'change'}
          darkTheme
        />
      </SecondLevelNavigation>
    </div>
  );
}
