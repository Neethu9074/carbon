/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import {
  sapSystemListFullyQualified,
  sapInstanceListFullyQualified,
  sapDbInstanceListFullyQualified
} from 'in-sap/navigation/paths';
import { SecondLevelNavigation, SecondLevelNavigationItem } from '@instana/components';
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
import DashboardHeaderModule, { themes } from 'in-components/DashboardHeader/DashboardHeaderModule';
// TODO: fix the depreciation to use useNavigate instead
import { isView } from 'in-stores/navigation/navigation';
import DashboardHeader from 'in-components/DashboardHeader';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';


export default connectTo(
  {
    isSapAbapSystemViewActive: isView(sapSystemListFullyQualified),
    isSapAbapInstanceViewActive: isView(sapInstanceListFullyQualified),
    isSapDbInstanceViewActive: isView(sapDbInstanceListFullyQualified)
  },
  function SapViewSwitcher({ isSapAbapSystemViewActive, isSapAbapInstanceViewActive, isSapDbInstanceViewActive }) {
    const {location, createHref} = useNavigation()
    const targetLocationSystem = {...location, pathname: `${sapSystemListFullyQualified}`}
    const targetLocationInstance = {...location, pathname: `${sapInstanceListFullyQualified}`}
    const targetLocationDbInstance = {...location, pathname: `${sapDbInstanceListFullyQualified}`}
    return (
      <>
        <DashboardHeader icon="lib_sap" label={t('in-sap:SAPHeader')} title={t('in-sap:SAPHeader')} />
        <DashboardHeaderModule theme={themes.light}>
          <SecondLevelNavigation>
            <SecondLevelNavigationItem
              href={createHref(targetLocationSystem)}
              icon="lib_sap_host"
              label={t('in-sap:abapSystems')}
              isActive={isSapAbapSystemViewActive}
            />
            <SecondLevelNavigationItem
              href={createHref(targetLocationInstance)}
              icon="lib_sap_instances"
              label={t('in-sap:abapOrJavaInstances')}
              isActive={isSapAbapInstanceViewActive}
            />
            <SecondLevelNavigationItem
              href={createHref(targetLocationDbInstance)}
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
);
