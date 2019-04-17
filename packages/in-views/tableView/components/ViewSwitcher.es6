import React, { Fragment } from 'react';

import { physicalTablePath, physicalPath, containerPath, isTableView } from 'in-stores/navigation/paths/mainPaths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { any } from 'in-services/fixedStreams';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isMapActive: any(isView(physicalPath), isView(containerPath)),
    isTableActive: isTableView('physical')
  },
  function KubernetesViewSwitcher({ isMapActive, isTableActive }) {
    return (
      <Fragment>
        <SecondLevelNavigation useFullAvailableWidth>
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
        </SecondLevelNavigation>
        <TimeSelection />
      </Fragment>
    );
  }
);
