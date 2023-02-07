/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import { dummyPoPProperties, PoPInstallationPropertiesResponse } from 'in-synthetics/utils/constants';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import PopDeployButton from 'in-synthetics/dashboards/global/tabs/tests/components/PopDeployButton';
import getPoPInstallationProperties from 'in-synthetics/subscriptions/getPoPInstallationProperties';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-components/DashboardHeader';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import * as paths from 'in-synthetics/navigation/paths';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher() {
  const isTestsActive = useObservable(isView(paths.syntheticsPath), []);
  const isLocationsActive = useObservable(isView(paths.syntheticLocationPath), []);
  const isSmartAlertsActive = useObservable(isView(paths.syntheticSmartAlertsPath), []);

  const popProperties: PoPInstallationPropertiesResponse =
    useObservable<any, [number]>(() => getPoPInstallationProperties({ installationType: 'simple' }), [0]) ||
    dummyPoPProperties;

  const renderMetaInformation = () => {
    return <BetaBadge />;
  };

  const dashboardHeaderProps = {
    icon: 'lib_synthetic',
    label: t('in-synthetics:dashboard.testList.mainLabel'),
    title: t('in-synthetics:dashboard.testList.mainLabel'),
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
              href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticsPath))}
              label={t('in-synthetics:dashboard.testList.secondaryLabels.tests')}
              isActive={isTestsActive && !isLocationsActive && !isSmartAlertsActive}
              icon={'lib_synthetic'}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticLocationPath))}
              label={t('in-synthetics:dashboard.testList.secondaryLabels.locations')}
              isActive={isLocationsActive && !isTestsActive && !isSmartAlertsActive}
              icon={'lib_synthetic_location'}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticSmartAlertsPath))}
              label={t('in-synthetics:dashboard.testList.secondaryLabels.smartAlerts')}
              isActive={isSmartAlertsActive && !isTestsActive && !isLocationsActive}
              icon={'lib_alerts_alert'}
            />
          </SecondLevelNavigation>
          {!popProperties.progress.loading && (
            //For PoP installation, right now, the value of instanaAgentKey is the same as the value of downloadKey.
            <PopDeployButton
              downloadKey={popProperties.data?.downloadKey || ''}
              agentKey={popProperties.data?.downloadKey || ''}
              agentKeys={popProperties.data?.agentKeys || []}
              syntheticAcceptorURL={popProperties.data?.syntheticAcceptorURL || ''}
            />
          )}
        </div>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
