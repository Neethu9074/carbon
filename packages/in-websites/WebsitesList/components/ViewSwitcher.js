import React, { Fragment } from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import TimeSelection from 'in-new-components/time/TimeSelection/TimeSelection';

export default function KubernetesViewSwitcher() {
  return (
    <Fragment>
      <SecondLevelNavigation>
        <SecondLevelNavigationItem icon="lib_website" label="Websites" isActive />
      </SecondLevelNavigation>
      <TimeSelection />
    </Fragment>
  );
}
