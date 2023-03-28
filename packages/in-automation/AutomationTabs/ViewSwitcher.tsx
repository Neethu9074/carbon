/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import { actionCatalogPath } from 'in-automation/navigation/paths';
import DashboardHeader from 'in-components/DashboardHeader';
import BetaBadge from 'in-components/BetaBadge/BetaBadge';
import { t } from 'in-i18n';

const dashboardHeaderProps = {
  icon: 'lib_automation',
  label: t('in-automation:automation'),
  title: t('in-automation:automation'),
  showHistoricDataWarning: false,
  renderMetaInformation: () => {
    return <BetaBadge />;
  }
};
export default function ViewSwitcher() {
  const isCatalogActive = useObservable(isView(actionCatalogPath), []);

  return (
    <>
      <DashboardHeader {...dashboardHeaderProps} />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = actionCatalogPath))}
            label={t('in-automation:ActionCatalog.actionCatalog')}
            isActive={isCatalogActive}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
