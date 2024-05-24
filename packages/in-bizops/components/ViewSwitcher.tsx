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
import { bizopsPerspectivesEnabled } from 'in-services/featureFlags';
import DashboardHeader from 'in-components/DashboardHeader';
import { clickBizopsTabsTracker } from 'in-bizops/tracker';
import * as paths from 'in-bizops/navigation/paths';
import { t } from 'in-i18n';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isProcessesActive = matchLocation(paths.businessProcessPath);
  const isPerspectivesActive = matchLocation(paths.businessPerspectivesPath);

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
            {bizopsPerspectivesEnabled && (
              <SecondLevelNavigationItem
                href={createHrefToPath(paths.businessPerspectivesPath)}
                label={t('in-bizops:labelPerspectives')}
                isActive={isPerspectivesActive && !isProcessesActive}
                icon={'lib_bizops'}
                onClick={() => {
                  clickBizopsTabsTracker({ tab: 'Perspectives' });
                }}
              />
            )}
            <SecondLevelNavigationItem
              href={createHrefToPath(paths.businessProcessPath)}
              label={t('in-bizops:labelBizOps')}
              isActive={isProcessesActive && !isPerspectivesActive}
              icon={'lib_bizops'}
              onClick={() => {
                clickBizopsTabsTracker({ tab: 'Processes' });
              }}
            />
          </SecondLevelNavigation>
        </div>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
