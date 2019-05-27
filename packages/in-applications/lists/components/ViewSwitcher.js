import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import HeaderWithTimeSelection from 'in-new-components/time/TimeSelection/HeaderWithTimeSelection';
import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList)
  },
  function AppViewSwitcher({ isServiceViewActive }) {
    return (
      <HeaderWithTimeSelection>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = applicationsList))}
            icon="lib_application"
            label="Applications"
            isActive={!isServiceViewActive}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = servicesList))}
            icon="lib_application_service"
            label="Services"
            isActive={isServiceViewActive}
          />
        </SecondLevelNavigation>
      </HeaderWithTimeSelection>
    );
  }
);
