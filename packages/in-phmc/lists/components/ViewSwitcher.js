/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from 'in-components/SecondLevelNavigation';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { phmcListFullyQualified, systemListFullyQualified } from 'in-phmc/navigation/paths';
import { getModifiedUrlStream, isView } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-components/DashboardHeader';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

export default connectTo(
  {
    isPhmcViewActive: isView(phmcListFullyQualified),
    isSystemViewActive: isView(systemListFullyQualified)
  },
  function PhmcViewSwitcher({ isPhmcViewActive, isSystemViewActive }) {
    return (
      <>
        <DashboardHeader label={t('in-phmc:ibmpPhmcs')} title={t('in-phmc:ibmpPhmcs')} />

        <DashboardHeaderModule theme={themes.light}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = phmcListFullyQualified))}
              label={t('in-phmc:hmcs')}
              isActive={isPhmcViewActive}
            />
            <SecondLevelNavigationItem
              href$={getModifiedUrlStream(p => (p.pathname = systemListFullyQualified))}
              label={t('in-phmc:systems')}
              isActive={isSystemViewActive}
            />
          </SecondLevelNavigation>
        </DashboardHeaderModule>
        <DashboardHeaderShadowModule />
      </>
    );
  }
);
