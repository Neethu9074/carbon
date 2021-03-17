/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-new-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-new-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-new-components/DashboardHeader/DashboardHeaderModule';
import { applicationsList, servicesList, globalAlertsList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { globalSmartAlertsEnabled } from 'in-services/featureFlags';
import DashboardHeader from 'in-new-components/DashboardHeader';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList),
    isSmartAlertsViewActive: isView(globalAlertsList)
  },
  function AppViewSwitcher({ isServiceViewActive, isSmartAlertsViewActive }) {
    return (
      <>
        <DashboardHeader
          icon="lib_application_invert"
          label={t('in-applications:labelApplications')}
          title={t('in-applications:labelApplications')}
        />
        <DashboardHeaderModule theme={themes.light}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = applicationsList))}
              icon="lib_application"
              label={t('in-applications:labelApplications')}
              isActive={!isServiceViewActive && !isSmartAlertsViewActive}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = servicesList))}
              icon="lib_application_service"
              label={t('in-applications:labelServices')}
              isActive={isServiceViewActive && !isSmartAlertsViewActive}
            />

            {globalSmartAlertsEnabled && (
              <SecondLevelNavigationItem
                href$={getModifiedUrlStream(p => (p.pathname = globalAlertsList))}
                icon="lib_events_warning"
                label={t('in-applications:labelSmartAlerts')}
                isActive={isSmartAlertsViewActive && !isServiceViewActive}
              />
            )}
          </SecondLevelNavigation>
        </DashboardHeaderModule>
        <DashboardHeaderShadowModule />
      </>
    );
  }
);
