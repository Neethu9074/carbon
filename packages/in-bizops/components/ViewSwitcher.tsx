/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// import PopDeployButton from 'in-synthetics/dashboards/global/tabs/tests/components/PopDeployButton';
// import getPoPInstallationProperties from 'in-synthetics/subscriptions/getPoPInstallationProperties';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
// import { dummyPoPProperties, PoPInstallationPropertiesResponse } from 'in-synthetics/utils/constants';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
// @ts-expect-error Module needs to be translated to TS
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
// import { role } from 'in-stores/user';
import { t } from 'in-i18n';
import DashboardHeader from 'in-components/DashboardHeader';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import * as paths from 'in-bizops/navigation/paths';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher() {
  const isProcessesActive = useObservable(isView(paths.bizOpsPath), []);
  const isActivitiesActive = useObservable(isView(paths.activitiesPath), []);
  const isSmartAlertsActive = useObservable(isView(paths.smartAlertsPath), []);

  // const popProperties: PoPInstallationPropertiesResponse =
  //   useObservable<any, [number]>(() => getPoPInstallationProperties({ installationType: 'simple' }), [0]) ||
  //   dummyPoPProperties;

  const renderMetaInformation = () => {
    return <BetaBadge />;
  };

  const dashboardHeaderProps = {
    icon: 'lib_bizops',
    label: t('in-bizops:navigation.bizOps'),
    title: t('in-bizops:navigation.bizOps'),
    showHistoricDataWarning: false,
    renderMetaInformation
  };

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <DashboardHeaderModule theme={themes.light}>
        <div className={locals.firstLine}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.bizOpsPath))}
              label={t('in-bizops:labelBizOps')}
              isActive={isProcessesActive && !isActivitiesActive && !isSmartAlertsActive}
              icon={'lib_bizops'}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.activitiesPath))}
              label={t('in-bizops:labelActivities')}
              isActive={isActivitiesActive && !isProcessesActive && !isSmartAlertsActive}
              icon={'lib_application_service'}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.smartAlertsPath))}
              label={t('in-bizops:labelSmartAlerts')}
              isActive={isSmartAlertsActive && !isProcessesActive && !isActivitiesActive}
              icon={'lib_alerts_alert'}
            />
          </SecondLevelNavigation>
          {/* {!popProperties.progress.loading && role?.canConfigureSyntheticLocations && (
            <PopDeployButton
              downloadKey={popProperties.data?.downloadKey || ''}
              agentKey={popProperties.data?.downloadKey || ''}
              agentKeys={popProperties.data?.agentKeys || []}
              syntheticAcceptorURL={popProperties.data?.syntheticAcceptorURL || ''}
            />
          )} */}
        </div>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
