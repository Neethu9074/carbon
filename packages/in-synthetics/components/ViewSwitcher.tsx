/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { useObservable } from '@instana/hooks';

// @ts-expect-error Module needs to be translated to TS
import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-components/DashboardHeader';
import * as paths from 'in-synthetics/navigation/paths';
import { t } from 'in-i18n';

export default function ViewSwitcher() {
  const isTestsActive = useObservable(isView(paths.syntheticsPath), []);
  /* Once the location view is fully implemented
  and the path enabled isLocationsActive should mimic the behavior of tests navigation item. */
  const isLocationsActive = useObservable(isView('/locations'), []);

  return (
    <>
      <DashboardHeader
        icon="lib_infra_ibmCos"
        label={t('in-synthetics:dashboard.testList.mainLabel')}
        title={t('in-synthetics:dashboard.testList.mainLabel')}
        showHistoricDataWarning={false}
      />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticsPath))}
            label={t('in-synthetics:dashboard.testList.secondaryLabels.tests')}
            isActive={isTestsActive && !isLocationsActive}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticsPath))}
            label={t('in-synthetics:dashboard.testList.secondaryLabels.location')}
            isActive={isLocationsActive && !isTestsActive}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
