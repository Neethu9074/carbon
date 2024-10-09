/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import ViewSwitcher from 'in-synthetics/dashboards/global/tabs/tests/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import Sticky from 'in-components/Sticky';
import Footer from 'in-components/Footer';

export default function CredentialList() {
  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: productAreas.synthetic_monitoring,
            pageRootName: pageNames.synthetic_credentials
          }}
        />
        <div>Synthetic Credentials View</div>
      </LeftRightPadding>
      <Footer />
    </Sticky>
  );
}
