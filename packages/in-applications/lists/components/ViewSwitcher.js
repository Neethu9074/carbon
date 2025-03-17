/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import { alertsList, applicationsList, servicesList, subtracesList } from 'in-applications/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { applicationSubtracesEnabled } from 'in-services/featureFlags';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function AppViewSwitcher() {
  const { createHrefToPath, matchLocation } = useNavigation();

  const isApplicationsViewActive = matchLocation(applicationsList);
  const isServiceViewActive = matchLocation(servicesList);
  const isSmartAlertsViewActive = matchLocation(alertsList);
  const isSubtraceViewActive = matchLocation(subtracesList);

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
            href={createHrefToPath(applicationsList)}
            icon="lib_application"
            label={t('in-applications:labelApplications')}
            isActive={isApplicationsViewActive}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(servicesList)}
            icon="lib_application_service"
            label={t('in-applications:labelServices')}
            isActive={isServiceViewActive}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(alertsList)}
            icon="lib_alerts_alert"
            label={t('in-applications:labelSmartAlerts')}
            isActive={isSmartAlertsViewActive}
          />
          {applicationSubtracesEnabled && (
            <SecondLevelNavigationItem
              href={createHrefToPath(subtracesList)}
              icon="lib_application_call"
              label={t('in-applications:subtraces.labelSubtraces')}
              isActive={isSubtraceViewActive}
            />
          )}
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
