/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { zhmcListFullyQualified, cpcListFullyQualified } from 'in-zhmc/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function ZhmcViewSwitcher() {
  const { matchLocation, createHrefToPath } = useNavigation();
  const isZhmcViewActive = matchLocation(zhmcListFullyQualified);
  const isCpcViewActive = matchLocation(cpcListFullyQualified);

  return (
    <>
      <DashboardHeader icon="lib_zhmcConsole" label={t('in-zhmc:ibmzZhmcs')} title={t('in-zhmc:ibmzZhmcs')} />

      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(zhmcListFullyQualified)}
            label={t('in-zhmc:zhmcs')}
            isActive={isZhmcViewActive}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(cpcListFullyQualified)}
            label={t('in-zhmc:systems')}
            isActive={isCpcViewActive}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
