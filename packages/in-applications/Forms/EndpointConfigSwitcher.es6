import React from 'react';

import { configureEndpointsView, syntheticEndpointsList } from 'in-applications/navigation/paths';
import { SideNavigation, SideNavigationItem } from 'in-new-components/SideNavigation';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isConfigureEndpointsView: isView(configureEndpointsView),
    isSyntheticEndpointsView: isView(syntheticEndpointsList)
  },
  function ServiceConfigSwitcher({ isConfigureEndpointsView, isSyntheticEndpointsView }) {
    return (
      <SideNavigation title="CONFIGURE">
        <SideNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = configureEndpointsView))}
          icon="lib_application_endpoint"
          label="Configure Endpoints"
          isActive={isConfigureEndpointsView}
        />
        <SideNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = syntheticEndpointsList))}
          icon="lib_application_endpoint"
          label="Synthetic Endpoints"
          isActive={isSyntheticEndpointsView}
        />
      </SideNavigation>
    );
  }
);
