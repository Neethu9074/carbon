/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-new-components/DashboardHeader';
import connectTo from 'in-hoc/connectTo';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList)
  },
  function AppViewSwitcher({ isServiceViewActive }) {
    return (
      <>
        <DashboardHeader icon="lib_application_invert" label="Applications" title="Applications" />
        <DashboardHeaderModule theme={themes.light}>
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
        </DashboardHeaderModule>
        <DashboardHeaderShadowModule />
      </>
    );
  }
);
