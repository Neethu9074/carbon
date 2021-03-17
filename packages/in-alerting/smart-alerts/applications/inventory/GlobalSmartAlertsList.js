/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { just } from '@instana/observables';
import React, { useState } from 'react';

import SmartAlertsNoDataNotification from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsNoDataNotification';
import WithEmptyStateFallback from 'in-new-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import ViewTrackingMeta from 'in-services/tracking/ViewTrackingMeta';
import SmartAlertsBaseList from './SmartAlertsBaseList';
import Footer from 'in-new-components/Footer';
import Sticky from 'in-components/Sticky';
import Card from 'in-new-components/Card';

export default function GlobalSmartAlertsList() {
  const [hasDataToRender, setHasDataToRender] = useState(true);

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            productArea: 'Applications',
            pageRootName: 'Smart Alerts'
          }}
        />
        <WithEmptyStateFallback
          getHasDataToRender={() => just(hasDataToRender)}
          FallbackComponent={SmartAlertsNoDataNotification}
        >
          <Card useMaxAvailableHeight={false} hasMarginBottom>
            <SmartAlertsBaseList onNoData={() => setHasDataToRender(false)} />
          </Card>
        </WithEmptyStateFallback>
      </LeftRightPadding>

      <Footer />
    </Sticky>
  );
}

// reloadEntitiesSignal$.emit(true);
