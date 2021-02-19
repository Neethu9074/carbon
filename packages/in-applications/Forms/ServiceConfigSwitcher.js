/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
      <SideNavigation title={t('in-applications:titleConfigure')}>
        <SideNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = newServiceView))}
          icon="lib_application_service"
          label={t('in-applications:labelCustomServiceRules')}
          isActive={isNewServiceViewActive}
        />
        <SideNavigationItem
          href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}
          icon="lib_application_endpoint"
          label={t('in-applications:labelSyntheticEndpoints')}
          isActive={isConfigureSyntheticEndpointsViewActive}
        />
      </SideNavigation>
    );
  }
);
