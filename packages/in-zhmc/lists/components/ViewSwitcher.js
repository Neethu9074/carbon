/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { zhmcListFullyQualified, cpcListFullyQualified } from 'in-zhmc/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-components/DashboardHeader';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isZhmcViewActive: isView(zhmcListFullyQualified),
    isCpcViewActive: isView(cpcListFullyQualified)
  },
  function ZhmcViewSwitcher({ isZhmcViewActive, isCpcViewActive }) {
    return (
      <>
        <DashboardHeader icon="lib_zhmcConsole" label={t('in-zhmc:ibmzZhmcs')} title={t('in-zhmc:ibmzZhmcs')} />

        <DashboardHeaderModule theme={themes.light}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = zhmcListFullyQualified))}
              label={t('in-zhmc:zhmcs')}
              isActive={isZhmcViewActive}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = cpcListFullyQualified))}
              label={t('in-zhmc:systems')}
              isActive={isCpcViewActive}
            />
          </SecondLevelNavigation>
        </DashboardHeaderModule>
        <DashboardHeaderShadowModule />
      </>
    );
  }
);
