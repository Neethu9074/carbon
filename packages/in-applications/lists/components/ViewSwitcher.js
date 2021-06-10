/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { applicationsList, servicesList, alertsList } from 'in-applications/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function AppViewSwitcher() {
  const isServiceViewActive = useObservable(isView(servicesList), []);
  const isSmartAlertsViewActive = useObservable(isView(alertsList), []);

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

          {applicationSmartAlertsEnabled && (
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = alertsList))}
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
