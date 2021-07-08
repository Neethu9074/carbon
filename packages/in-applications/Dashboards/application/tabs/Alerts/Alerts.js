/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import { Card } from '@instana/components';

import {
  evaluationInfoColumnDefinition,
  entityNameColumnDefinition,
  filtersColumnDefinition,
  editActionsColumnDefinition,
  linkedListNameColumnDefinition
} from 'in-alerting/smart-alerts/applications/components/list/columns/columnDefinitions';
import { getAllGlobalAlertConfigsRelatedToApplicationId } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import SmartAlertsBaseListWithUrlState from 'in-alerting/smart-alerts/applications/components/list/SmartAlertsBaseListWithUrlState';
import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import Footer from 'in-components/Footer/Footer';

export default function Alerts({ applicationId }) {
  const location = useLocation();
  return (
    <>
      <Card>
        <SmartAlertsBaseListWithUrlState
          getLocalAlertConfigsFetchFunction={() => getAllAlertConfigs(applicationId, { asObservable: true })}
          getGlobalAlertConfigFetchFunction={() =>
            getAllGlobalAlertConfigsRelatedToApplicationId(applicationId, { asObservable: true })
          }
          columnDefinitions={getColumnDefinitions(location)}
        />
      </Card>
      <Footer />
    </>
  );
}

function getColumnDefinitions(location) {
  return [
    linkedListNameColumnDefinition(location),
    evaluationInfoColumnDefinition(),
    entityNameColumnDefinition(),
    filtersColumnDefinition(),
    editActionsColumnDefinition()
  ];
}

Alerts.propTypes = {
  applicationId: PropTypes.string.isRequired
};
