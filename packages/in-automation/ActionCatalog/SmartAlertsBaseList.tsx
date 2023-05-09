/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { sortOptions } from 'in-alerting/smart-alerts/applications/list/constants';
import AlertBaseList from 'in-alerting/smart-alerts/components/AlertsBaseList';
//import { getAllAlertConfigsForAllApplications } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';
// import { getAllAlertConfigs } from 'in-alerting/smart-alerts/applications/api/applicationAlertConfig';

export default function SmartAlertsBaseList(props: any) {
  const { rightHeader, tableActions, noDataMessage, pageSize, columnDefinitions, loadEntities } = props;
  return (
    <AlertBaseList<any>
      extraColumnDefinitions={columnDefinitions}
      addExtraColumn
      loadEntities={loadEntities}
      rightHeader={rightHeader}
      tableActions={tableActions}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      sortOptions={sortOptions}
    />
  );
}
