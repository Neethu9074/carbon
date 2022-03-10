/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import { t } from 'in-i18n';

export default function AppViewSwitcher() {
  const BASE_URL = '/config/migration/import';
  const applicationsList = BASE_URL + '/applications';
  const alertsList = BASE_URL + '/alerts';
  const servicesList = BASE_URL + '/services';
  const isServiceViewActive = useObservable(isView(servicesList), []);
  const isSmartAlertsViewActive = useObservable(isView(alertsList), []);

  return (
    <>
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
            icon="lib_website"
            label={t('in-cockpit:cockpit.websites')}
            isActive={isServiceViewActive && !isSmartAlertsViewActive}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = servicesList))}
            icon="lib_mobile_app"
            label={t('in-cockpit:cockpit.mobileApps')}
            isActive={isServiceViewActive && !isSmartAlertsViewActive}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = servicesList))}
            icon="lib_help_error_warning"
            label={t('in-analyze:analyzeView.dataSources.customEvents2')}
            isActive={isServiceViewActive && !isSmartAlertsViewActive}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = servicesList))}
            icon="lib_events_critical"
            label={t('in-alerting:smartAlerts.components.alertsHub.infrastructure.button0')}
            isActive={isServiceViewActive && !isSmartAlertsViewActive}
          />

          {applicationSmartAlertsEnabled && (
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = alertsList))}
              icon="lib_alerts_alert"
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
