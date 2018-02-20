import React from 'react';

import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { ViewSwitcher, Item } from 'in-new-components/ViewSwitcher';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList)
  },
  function AppViewSwitcher({ isServiceViewActive }) {
    return (
      <ViewSwitcher>
        <Item href$={getModifiedUrlStream(p => (p.pathname = applicationsList))} active={!isServiceViewActive}>
          Applications
        </Item>
        <Item href$={getModifiedUrlStream(p => (p.pathname = servicesList))} active={isServiceViewActive}>
          Services
        </Item>
      </ViewSwitcher>
    );
  }
);
