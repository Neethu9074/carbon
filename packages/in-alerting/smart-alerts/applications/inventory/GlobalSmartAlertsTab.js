/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { just } from '@instana/observables';
import { Card } from '@instana/components';

import SmartAlertsNoDataNotification from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsNoDataNotification';
import CreateGlobalSmartAlertButton from 'in-alerting/smart-alerts/applications/components/CreateGlobalSmartAlertButton';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList';
import FloatingActionButtons from 'in-components/FloatingActionButton/FloatingActionButtons';
import { categoryLocal } from 'in-alerting/smart-alerts/applications/inventory/constants';
import AlertDetails from 'in-alerting/smart-alerts/applications/details/AlertDetails';
import WithEmptyStateFallback from 'in-components/WithEmptyStateFallback';
import ViewSwitcher from 'in-applications/lists/components/ViewSwitcher';
import { applicationSmartAlertsEnabled } from 'in-services/featureFlags';
import { globalAlertDetails } from 'in-applications/navigation/paths';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import { applicationId } from 'in-applications/navigation/matrix';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Footer from 'in-components/Footer';
import Sticky from 'in-components/Sticky';
import { role } from 'in-stores/user';

export default function GlobalSmartAlertsTab({ location }) {
  const [hasDataToRender, setHasDataToRender] = useState(true);
  const timeConfig = useTimeConfig();

  const isGlobalDetailsView = location.pathname === globalAlertDetails;

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
            {isGlobalDetailsView ? (
              <AlertDetails location={location} timeConfig={timeConfig} />
            ) : (
              <SmartAlertsBaseList
                onNoData={() => setHasDataToRender(false)}
                getLocalAlertConfigsFetchFunction={() => getAllAlertConfigsForAllApplications({ asObservable: true })}
                getGlobalAlertConfigFetchFunction={() => getAllGlobalAlertConfigs({ asObservable: true })}
                additionalMatrixKeys={({ configsCategory, config }) => {
                  return configsCategory === categoryLocal ? [{ key: applicationId, value: config.applicationId }] : [];
                }}
              />
            )}
          </Card>
        </WithEmptyStateFallback>
      </LeftRightPadding>
      {role.canConfigureGlobalAlertConfigs && applicationSmartAlertsEnabled && (
        <FloatingActionButtons>
          <CreateGlobalSmartAlertButton location={location} />
        </FloatingActionButtons>
      )}
      <Footer />
    </Sticky>
  );
}
