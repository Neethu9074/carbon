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
  const isTabActive = useObservable(isView(paths.bizopsPath), []);
  // const isLocationsActive = useObservable(isView(paths.syntheticLocationPath), []);
  // const isSmartAlertsActive = useObservable(isView(paths.syntheticSmartAlertsPath), []);

  // const popProperties: PoPInstallationPropertiesResponse =
  //   useObservable<any, [number]>(() => getPoPInstallationProperties({ installationType: 'simple' }), [0]) ||
  //   dummyPoPProperties;

  const renderMetaInformation = () => {
    return <BetaBadge />;
  };

  const dashboardHeaderProps = {
    icon: 'lib_camunda',
    label: t('in-bizops:labelBizOps'),
    title: t('in-bizops:labelBizOps'),
    showHistoricDataWarning: false,
    renderMetaInformation
  };

  // const isTabActive = true;

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <DashboardHeaderModule theme={themes.light}>
        <div className={locals.firstLine}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.bizopsPath))}
              label={t('in-bizops:labelBizOps')}
              isActive={isTabActive}
              icon={'lib_camunda'}
            />
            {/* <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticLocationPath))}
              label={t('in-synthetics:dashboard.testList.secondaryLabels.locations')}
              isActive={isLocationsActive && !isTestsActive && !isSmartAlertsActive}
              icon={'lib_synthetic_location'}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticSmartAlertsPath))}
              label={t('in-synthetics:dashboard.testList.secondaryLabels.smartAlerts')}
              isActive={isSmartAlertsActive && !isTestsActive && !isLocationsActive}
              icon={'lib_alerts_alert'}}
            { /> */}
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
