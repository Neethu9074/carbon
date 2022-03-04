/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import DashboardHeader from 'in-components/DashboardHeader';
import Footer from 'in-components/Footer';

const header = (
  //Page label and title needs to be replaced with the real test label value
  <>
    <DashboardHeader icon="lib_infra_ibmCos" label={'Test1'} title={'Test1'} />
    <DashboardHeaderShadowModule />
  </>
);

export default function SummaryDashboard() {
  return (
    <Sticky header={header}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: 'EUM: Synthetics',
            pageRootName: 'Synthetics Test'
          }}
        />
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}
