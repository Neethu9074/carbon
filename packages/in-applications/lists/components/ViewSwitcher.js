/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { alertsList, applicationsList, servicesList } from 'in-applications/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function AppViewSwitcher() {
  const { location, createHref, matchLocation } = useNavigation();

  const isServiceViewActive = matchLocation(servicesList);
  const isSmartAlertsViewActive = matchLocation(alertsList);

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
          <SecondLevelNavigationItem
            href={createHref({ ...location, pathname: alertsList })}
            icon="lib_alerts_alert"
            label={t('in-applications:labelSmartAlerts')}
            isActive={isSmartAlertsViewActive && !isServiceViewActive}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
