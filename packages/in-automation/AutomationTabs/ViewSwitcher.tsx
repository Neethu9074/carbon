/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { actionCatalogPath, actionHistoryPath, policiesFullyQualified } from 'in-automation/navigation/paths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { actionHistoryTracker } from 'in-automation/tracker';
import DashboardHeader from 'in-components/DashboardHeader';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

const dashboardHeaderProps = {
  icon: 'lib_automation',
  label: t('in-automation:automation'),
  title: t('in-automation:automation'),
  showHistoricDataWarning: false
};
export default function ViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isCatalogActive = matchLocation(actionCatalogPath);
  const isHistoryActive = matchLocation(actionHistoryPath);
  const isPoliciesActive = matchLocation(policiesFullyQualified);

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(actionCatalogPath)}
            label={t('in-automation:ActionCatalog.actionCatalog')}
            isActive={isCatalogActive}
          />
          {role?.canViewAutomationActionInstances && (
            <SecondLevelNavigationItem
              href={createHrefToPath(actionHistoryPath)}
              label={t('in-automation:actionHistory.actionHistory')}
              isActive={isHistoryActive}
              onClick={() => {
                actionHistoryTracker();
              }}
            />
          )}
          {role?.canConfigureAutomationPolicies && (
            <SecondLevelNavigationItem
              href={createHrefToPath(policiesFullyQualified)}
              label={t('in-automation:policies.policies')}
              isActive={isPoliciesActive}
            />
          )}
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
