/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useLocation } from 'react-router';
import PropTypes from 'prop-types';
import React from 'react';

import {
  linkedListNameColumnDefinition,
  evaluationInfoColumnDefinition,
  entityNameColumnDefinition,
  filtersColumnDefinition,
  editActionsColumnDefinition
} from 'in-alerting/smart-alerts/applications/components/list/columns/columnDefinitions';
import SmartAlertsBaseListWithUrlState from 'in-alerting/smart-alerts/applications/components/list/SmartAlertsBaseListWithUrlState';
import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
import { getAllGlobalAlertConfigs } from 'in-alerting/smart-alerts/applications/api/globalApplicationAlertConfigs';
import { categoryLocal } from 'in-alerting/smart-alerts/applications/components/list/constants';
import { applicationId } from 'in-applications/navigation/matrix';

export default function GlobalInventorySmartAlertsList({ onNoData }) {
  const location = useLocation();
  return (
    <SmartAlertsBaseListWithUrlState
      onNoData={onNoData}
      getLocalAlertConfigsFetchFunction={() => getAllAlertConfigsForAllApplications({ asObservable: true })}
      getGlobalAlertConfigFetchFunction={() => getAllGlobalAlertConfigs({ asObservable: true })}
      columnDefinitions={getColumnDefinitions(location)}
    />
  );
}

function getColumnDefinitions(location) {
  return [
    linkedListNameColumnDefinition(location, ({ configsCategory, config }) => {
      return configsCategory === categoryLocal ? [{ key: applicationId, value: config.applicationId }] : [];
    }),
    evaluationInfoColumnDefinition(),
    entityNameColumnDefinition(),
    filtersColumnDefinition(),
    editActionsColumnDefinition()
  ];
}

GlobalInventorySmartAlertsList.propTypes = {
  onNoData: PropTypes.func
};
