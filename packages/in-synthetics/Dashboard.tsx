/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Card } from '@instana/components';

// @ts-expect-error Module needs to be translated to TS
import DashboardHeaderShadowModule from 'in-components/DashboardHeader/DashboardHeaderShadowModule';
// @ts-expect-error Module needs to be translated to TS
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
// @ts-expect-error Module needs to be translated to TS
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
// @ts-expect-error Module needs to be translated to TS
import DashboardHeader from 'in-components/DashboardHeader';
// @ts-expect-error Module needs to be translated to TS
import Sticky from 'in-components/Sticky';
// @ts-expect-error Module needs to be translated to TS
import Footer from 'in-components/Footer';
import Tests from 'in-synthetics/Tests';
import { t } from 'in-i18n';

const header = (
  <>
    <DashboardHeader
      icon="lib_infra_ibmCos"
      label={t('in-synthetics:dashboard.testList.mainLabel')}
      title={t('in-synthetics:dashboard.testList.mainLabel')}
    />
    <DashboardHeaderShadowModule />
  </>
);

export default function Dashboard() {
  return (
    <Sticky header={header}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: 'EUM: Websites',
            pageRootName: 'Websites'
          }}
        />
        <Card hasMarginBottom>
          <Tests />
        </Card>
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}
