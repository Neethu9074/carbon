/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { just } from '@instana/observables';
import { Card } from '@instana/components';

import GlobalInventorySmartAlertsList from 'in-alerting/smart-alerts/applications/inventory/GlobalInventorySmartAlertsList';
import SmartAlertsNoDataNotification from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsNoDataNotification';
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/CreateGlobalSmartAlertButton';
import CreateSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton';
import FloatingActionButtonMenu from 'in-components/FloatingActionButton/FloatingActionButtonMenu';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { applicationSmartAlertFullScreenDesignEnabled } from 'in-services/featureFlags';
import AlertDetails from 'in-alerting/smart-alerts/applications/details/AlertDetails';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { globalAlertDetails } from 'in-applications/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { productAreas } from 'in-services/tracking/productAreas';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pageNames } from 'in-services/tracking/pageNames';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/components/CreateSmartAlertButton.mless';

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
          <Card useMaxAvailableHeight={false} hasMarginBottom>
            {isGlobalDetailsView ? (
              <AlertDetails location={location} timeConfig={timeConfig} />
            ) : (
              <GlobalInventorySmartAlertsList onNoData={() => setHasDataToRender(false)} />
            )}
          </Card>
        </WithEmptyStateFallback>
      </LeftRightPadding>
      {role.canConfigureGlobalApplicationSmartAlerts && (
        <>
          {applicationSmartAlertFullScreenDesignEnabled && (
            <FloatingActionButtons>
              <FloatingActionButtonMenu>
                <span className={locals.floatingBtnMenu}>
                  <CreateGlobalSmartAlertButton location={location} />
                </span>
                <CreateSmartAlertButton
                  isGlobal
                  buttonName={t('in-alerting:smartAlerts.applications.components.createGlobalSmartAlertNew')}
                  isFloatingButton
                  isMenuItem
                />
              </FloatingActionButtonMenu>
            </FloatingActionButtons>
          )}

          {!applicationSmartAlertFullScreenDesignEnabled && (
            <FloatingActionButtons>
              <CreateGlobalSmartAlertButton location={location} />
            </FloatingActionButtons>
          )}
        </>
      )}
      <Footer />
    </Sticky>
  );
}
