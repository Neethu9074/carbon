/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';

import {
  sapSystemListFullyQualified,
  sapInstanceListFullyQualified,
  sapDbInstanceListFullyQualified
} from 'in-sap/navigation/paths';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import DashboardHeader from 'in-components/DashboardHeader';
import { t } from 'in-i18n';

export default function SapViewSwitcher() {
  const { location, createHrefToPath, matchLocation } = useNavigation();
  const isSapAbapSystemViewActive = matchLocation(sapSystemListFullyQualified);
  const isSapAbapInstanceViewActive = matchLocation(sapInstanceListFullyQualified);
  const isSapDbInstanceViewActive = matchLocation(sapDbInstanceListFullyQualified);

  return (
    <>
      <DashboardHeader icon="lib_sap" label={t('in-sap:SAPHeader')} title={t('in-sap:SAPHeader')} />
      <DashboardHeaderModule theme={themes.light}>
        <SecondLevelNavigation>
          <SecondLevelNavigationItem
            href={createHrefToPath(sapSystemListFullyQualified)}
            icon="lib_sap_host"
            label={t('in-sap:abapSystems')}
            isActive={isSapAbapSystemViewActive}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(sapInstanceListFullyQualified)}
            icon="lib_sap_instances"
            label={t('in-sap:abapOrJavaInstances')}
            isActive={isSapAbapInstanceViewActive}
          />
          <SecondLevelNavigationItem
            href={createHrefToPath(sapDbInstanceListFullyQualified)}
            icon="lib_sap_dbms"
            label={t('in-sap:sapdbinstance')}
            isActive={isSapDbInstanceViewActive}
          />
        </SecondLevelNavigation>
      </DashboardHeaderModule>
      <DashboardHeaderShadowModule />
    </>
  );
}
