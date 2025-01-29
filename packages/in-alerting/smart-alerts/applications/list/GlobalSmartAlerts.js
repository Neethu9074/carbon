/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { just } from '@instana/observables';

import GlobalInventorySmartAlertsList from 'in-alerting/smart-alerts/applications/inventory/GlobalInventorySmartAlertsList';
import SmartAlertsNoDataNotification from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsNoDataNotification';
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import AlertDetails from 'in-alerting/smart-alerts/applications/details/AlertDetails';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { smartAlertCarbonTableEnabled } from 'in-services/featureFlags';
import { globalAlertDetails } from 'in-applications/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { alertsTabDetails } from 'in-applications/navigation/paths';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';

export default function GlobalSmartAlerts({ location }) {
  const [hasDataToRender, setHasDataToRender] = useState(true);
  const timeConfig = useTimeConfig();

  const isGlobalDetailsView = location.pathname === globalAlertDetails;

  return (
    <Sticky header={<ViewSwitcher />}>
      <LeftRightPadding>
        <ViewTrackingMeta
          data={{
            // i18n: no need for translation, it is only used within tracking
            productArea: productAreas.applications,
            pageRootName: pageNames.smart_alerts,
            pagePath: location?.pathname
          }}
        />
        <WithEmptyStateFallback
          getHasDataToRender={() => just(hasDataToRender)}
          FallbackComponent={SmartAlertsNoDataNotification}
        >
          {isGlobalDetailsView ? (
            <AlertDetails location={location} timeConfig={timeConfig} />
          ) : (
            <>
              <GlobalInventorySmartAlertsList onNoData={() => setHasDataToRender(false)} />
              <Footer />
            </>
          )}
        </WithEmptyStateFallback>
      </LeftRightPadding>
      {role.canConfigureGlobalApplicationSmartAlerts &&
        ((location?.pathname === alertsTabDetails && smartAlertCarbonTableEnabled) ||
          !smartAlertCarbonTableEnabled) && <CreateGlobalSmartAlertButton location={location} />}
    </Sticky>
  );
}
