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
  const isLocationsActive = useObservable(isView(paths.syntheticLocationPath), []);

  return (
    <>
      <DashboardHeader
        icon="lib_synthetic"
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
            icon={'lib_synthetic'}
          />
          <SecondLevelNavigationItem
            href$={getModifiedUrlStream(p => (p.pathname = paths.syntheticLocationPath))}
            label={t('in-synthetics:dashboard.testList.secondaryLabels.locations')}
            isActive={isLocationsActive && !isTestsActive}
            icon={'lib_synthetic_location'}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
