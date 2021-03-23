/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { getAllGlobalAlertConfigsRelatedToApplicationId } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList';
import OldAlertsList from 'in-applications/Dashboards/application/tabs/Alerts/OldAlertsList';
import { globalSmartAlertsEnabled } from 'in-services/featureFlags';
import Footer from 'in-new-components/Footer/Footer';
import Card from 'in-new-components/Card';

export default function Alerts({ applicationName, applicationId }) {
  return (
    <>
      <Card>
        {globalSmartAlertsEnabled ? (
          <SmartAlertsBaseList
            getLocalAlertConfigsFetchFunction={() => getAllAlertConfigs(applicationId, { asObservable: true })}
            getGlobalAlertConfigFetchFunction={() =>
              getAllGlobalAlertConfigsRelatedToApplicationId(applicationId, { asObservable: true })
            }
            localSmartAlertsListProps={{
              applicationName
            }}
          />
        ) : (
          <OldAlertsList applicationName={applicationName} applicationId={applicationId} />
        )}
      </Card>
      <Footer />
    </>
  );
}

Alerts.propTypes = {
  applicationName: PropTypes.string.isRequired,
  applicationId: PropTypes.string.isRequired
};
