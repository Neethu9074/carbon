/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { clickBizopsProcessesTabsTracker } from 'in-bizops/tracker';
import DashboardHeader from 'in-components/DashboardHeader';
import * as paths from 'in-bizops/navigation/paths';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isProcessesActive = matchLocation(paths.businessProcessPath);
  const isActivitiesActive = matchLocation(paths.activitiesPath);
  /*
  The plumbing for an activity tab exists here. Waiting on UI list for all activities to be
  present before enabling the tab. Use the following component to enable the activities tab:
  <SecondLevelNavigationItem
    href={createHrefToPath(paths.activitiesPath)}
    label={t('in-bizops:labelActivities')}
    isActive={isActivitiesActive && !isProcessesActive}
    icon={'lib_application_service'}
  />
  */

  const dashboardHeaderProps = {
    icon: 'lib_bizops',
    label: t('in-bizops:navigation.businessMonitoring'),
    title: t('in-bizops:navigation.businessMonitoring'),
    showHistoricDataWarning: false
  };

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <DashboardHeaderModule theme={themes.light}>
        <div className={locals.firstLine}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href={createHrefToPath(paths.businessProcessPath)}
              label={t('in-bizops:labelBizOps')}
              isActive={isProcessesActive && !isActivitiesActive}
              icon={'lib_bizops'}
              onClick={() => {
                clickBizopsProcessesTabsTracker({ tab: 'Processes' });
              }}
            />
          </SecondLevelNavigation>
        </div>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
