/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

// @ts-expect-error Module needs to be translated to TS
import TabView from 'in-components/LocationAwareTabView/TabView';
import DashboardHeader, { DashboardHeaderProps } from 'in-components/DashboardHeader';
import tabs from 'in-synthetics/dashboards/summary/tabs/index';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';

function Header(props: DashboardHeaderProps) {
  //Page label and title needs to be replaced with the real test label value
  return (
    <DashboardHeader
      {...props}
      icon="lib_infra_ibmCos"
      title={'Test1'}
      label={'Test1'}
      showHistoricDataWarning={false}
    />
  );
}

export default function SyntheticSymmaryDashboard() {
  return (
    <>
      <ViewTrackingMeta
        data={{
          productArea: 'EUM: Synthetics',
          pageRootName: 'Synthetics Test'
        }}
      />

      <TabView HeaderComponent={Header} location={location} tabs={tabs} />
    </>
  );
}
