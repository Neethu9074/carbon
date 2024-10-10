/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { bizopsStandardInclusionEnabled } from 'in-services/featureFlags';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import * as paths from 'in-bizops/navigation/paths';
import { bizopsTabClick } from 'in-bizops/tracker';
import { t } from 'in-i18n';

export default function ViewSwitcher() {
  const { location, matchLocation, createHrefToPath } = useNavigation();
  const isProcessesActive = matchLocation(paths.businessProcessPath);
  const isPerspectivesActive = matchLocation(paths.businessPerspectivesPath);

  const dashboardHeaderProps = {
    icon: 'lib_bizops',
    label: t('in-bizops:navigation.businessMonitoring'),
    title: t('in-bizops:navigation.businessMonitoring'),
    showHistoricDataWarning: false
  };

  const hostCount = window.instana?.reportingData?.hostCount;
  let perspectivesDisabled = undefined;
  if (bizopsStandardInclusionEnabled && typeof hostCount === 'number' && hostCount < 1) {
    perspectivesDisabled = true;
  }

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(paths.businessPerspectivesPath)}
            label={t('in-bizops:labelPerspectives')}
            isActive={isPerspectivesActive && !isProcessesActive}
            isDisabled={perspectivesDisabled}
            onClick={() => {
              bizopsTabClick({ path: location.pathname, tab: 'Perspectives' });
            }}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(paths.businessProcessPath)}
            label={t('in-bizops:labelBizOps')}
            isActive={isProcessesActive && !isPerspectivesActive}
            onClick={() => {
              bizopsTabClick({ path: location.pathname, tab: 'Processes' });
            }}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
