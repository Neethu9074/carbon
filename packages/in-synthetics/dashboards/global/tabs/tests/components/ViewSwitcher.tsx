/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { syntheticCarbonTableEnabled, syntheticInstanaHostedPoPEnabled } from 'in-services/featureFlags';
import { dummyPoPProperties, PoPInstallationPropertiesResponse } from 'in-synthetics/utils/constants';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import PopDeployButton from 'in-synthetics/dashboards/global/tabs/tests/components/PopDeployButton';
import getPoPInstallationProperties from 'in-synthetics/subscriptions/getPoPInstallationProperties';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import * as paths from 'in-synthetics/navigation/paths';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isTestsActive = matchLocation(paths.syntheticsPath);
  const isLocationsActive = matchLocation(paths.syntheticLocationPath);
  const isSmartAlertsActive = matchLocation(paths.syntheticSmartAlertsPath);
  const isCredentialsActive = matchLocation(paths.syntheticCredentialPath);

  const popProperties: PoPInstallationPropertiesResponse =
    useObservable<any, [number]>(() => getPoPInstallationProperties({ installationType: 'simple' }), [0]) ||
    dummyPoPProperties;

  const dashboardHeaderProps = {
    icon: 'lib_synthetic',
    label: t('in-synthetics:dashboard.testList.mainLabel'),
    title: t('in-synthetics:dashboard.testList.mainLabel'),
    showHistoricDataWarning: false,
    liveModeDisabled: isLocationsActive,
    liveModeDisabledTooltip: t('in-synthetics:dashboard.locationList.locationLiveModeDisabled')
  };

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <DashboardHeaderModule theme={themes.light}>
        <div className={locals.firstLine}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href={createHrefToPath(paths.syntheticsPath)}
              label={
                syntheticCarbonTableEnabled
                  ? t('in-synthetics:dashboard.testList.secondaryLabels.syntheticTests')
                  : t('in-synthetics:dashboard.testList.secondaryLabels.tests')
              }
              isActive={isTestsActive && !isLocationsActive && !isCredentialsActive && !isSmartAlertsActive}
              icon={syntheticCarbonTableEnabled ? '' : 'lib_synthetic'}
            />
            <SecondLevelNavigationItem
              href={createHrefToPath(paths.syntheticLocationPath)}
              label={t('in-synthetics:dashboard.testList.secondaryLabels.locations')}
              isActive={isLocationsActive && !isTestsActive && !isCredentialsActive && !isSmartAlertsActive}
              icon={'lib_synthetic_location'}
            />
            {role?.canUseSyntheticCredentials && (
              <SecondLevelNavigationItem
                href={createHrefToPath(paths.syntheticCredentialPath)}
                label={t('in-synthetics:dashboard.testList.secondaryLabels.credentials')}
                isActive={isCredentialsActive && !isTestsActive && !isLocationsActive && !isSmartAlertsActive}
                icon={'lib_synthetic_credential'}
              />
            )}
            <SecondLevelNavigationItem
              href={createHrefToPath(paths.syntheticSmartAlertsPath)}
              label={t('in-synthetics:dashboard.testList.secondaryLabels.smartAlerts')}
              isActive={isSmartAlertsActive && !isTestsActive && !isLocationsActive && !isCredentialsActive}
              icon={'lib_alerts_alert'}
            />
          </SecondLevelNavigation>
          {!popProperties.progress.loading &&
            role?.canConfigureSyntheticLocations &&
            !syntheticInstanaHostedPoPEnabled && (
              <PopDeployButton
                downloadKey={popProperties.data?.downloadKey || ''}
                agentKey={popProperties.data?.agentKey || ''}
                syntheticAcceptorURL={popProperties.data?.syntheticAcceptorURL || ''}
              />
            )}
        </div>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
