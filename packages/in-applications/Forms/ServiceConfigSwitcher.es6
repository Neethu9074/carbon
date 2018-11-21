import React from 'react';

import { newServiceView, configureSyntheticEndpointsView } from 'in-applications/navigation/paths';
import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isNewServiceViewActive: isView(newServiceView),
    isConfigureSyntheticEndpointsViewActive: isView(configureSyntheticEndpointsView)
  },
  function ServiceConfigSwitcher({ isNewServiceViewActive, isConfigureSyntheticEndpointsViewActive }) {
    return (
      <SideNavigation title="CONFIGURE">
        <SideNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = newServiceView))}
          icon="lib_application_endpoint"
          label="Custom Services"
          isActive={isNewServiceViewActive}
        />
        <SideNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}
          icon="lib_application_endpoint"
          label="Synthetic Endpoints"
          isActive={isConfigureSyntheticEndpointsViewActive}
        />
      </SideNavigation>
    );
  }
);
