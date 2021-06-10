/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Card } from '@instana/components';

import { getAllGlobalAlertConfigsRelatedToApplicationId } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/inventory/SmartAlertsBaseList';
import Footer from 'in-components/Footer/Footer';

export default function Alerts({ applicationId }) {
  return (
    <>
      <Card>
        <SmartAlertsBaseList
          getLocalAlertConfigsFetchFunction={() => getAllAlertConfigs(applicationId, { asObservable: true })}
          getGlobalAlertConfigFetchFunction={() =>
            getAllGlobalAlertConfigsRelatedToApplicationId(applicationId, { asObservable: true })
          }
        />
      </Card>
      <Footer />
    </>
  );
}

Alerts.propTypes = {
  applicationId: PropTypes.string.isRequired
};
