/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { alertsList, applicationsList, servicesList } from 'in-applications/navigation/paths';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function AppViewSwitcher() {
  const { location, createHref, isView } = useNavigation();

  const isServiceViewActive = isView(servicesList);
  const isSmartAlertsViewActive = isView(alertsList);

  return (
    <>
      <DashboardHeader
        icon="lib_application_invert"
        label={t('in-applications:labelApplications')}
        title={t('in-applications:labelApplications')}
        showHistoricDataWarning={false}
      />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHref({ ...location, pathname: applicationsList })}
            icon="lib_application"
            label={t('in-applications:labelApplications')}
            isActive={!isServiceViewActive && !isSmartAlertsViewActive}
          />
          <SecondLevelNavigationItem
            href={createHref({ ...location, pathname: servicesList })}
            icon="lib_application_service"
            label={t('in-applications:labelServices')}
            isActive={isServiceViewActive && !isSmartAlertsViewActive}
          />

          {applicationSmartAlertsEnabled && (
            <SecondLevelNavigationItem
              href={createHref({ ...location, pathname: alertsList })}
              icon="lib_events_critical"
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
