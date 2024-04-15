/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { phmcListFullyQualified, systemListFullyQualified } from 'in-phmc/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function PhmcViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isPhmcViewActive = matchLocation(phmcListFullyQualified);
  const isSystemViewActive = matchLocation(systemListFullyQualified);

  return (
    <>
      <DashboardHeader label={t('in-phmc:ibmpPhmcs')} title={t('in-phmc:ibmpPhmcs')} />

      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(phmcListFullyQualified)}
            label={t('in-phmc:hmcs')}
            isActive={isPhmcViewActive}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(systemListFullyQualified)}
            label={t('in-phmc:systems')}
            isActive={isSystemViewActive}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
