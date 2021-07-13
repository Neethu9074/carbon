/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import PropTypes from 'prop-types';
import React from 'react';

import {
  evaluationInfoColumnDefinition,
  simpleListNameColumnDefinition,
  selectActionColumnDefinition
} from 'in-alerting/smart-alerts/applications/components/list/columns/columnDefinitions';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/components/list/SmartAlertsBaseList';

export default function SmartAlertSelectionList({
  onNoData,
  selection = [],
  onChange,
  getGlobalAlertConfigFetchFunction,
  getLocalAlertConfigsFetchFunction,
  pageSize
}) {
  return (
    <SmartAlertsBaseList
      onNoData={onNoData}
      getLocalAlertConfigsFetchFunction={getLocalAlertConfigsFetchFunction}
      getGlobalAlertConfigFetchFunction={getGlobalAlertConfigFetchFunction}
      columnDefinitions={getColumnDefinitions(selection, onChange)}
      pageSize={pageSize}
    />
  );
}

function getColumnDefinitions(selection, onChange) {
  return [
    selectActionColumnDefinition(selection, (id, state) => {
      if (state) {
        onChange([...selection, id]);
      } else {
        onChange(selection.filter(i => i !== id));
      }
    }),
    simpleListNameColumnDefinition('70%'),
    evaluationInfoColumnDefinition('25%')
  ];
}

SmartAlertSelectionList.propTypes = {
  /**
   * A function which returns an observable resolving with the api call result for
   * global smart alert configsSelected. Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from teh outside
   * aka. injecting params etc.
   */
  getGlobalAlertConfigFetchFunction: PropTypes.func,
  /**
   * A function which returns an observable resolving with the api call result for
   * local smart alert configsSelected. Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from the outside
   * aka. injecting params etc.
   */
  getLocalAlertConfigsFetchFunction: PropTypes.func,
  onNoData: PropTypes.func,
  selection: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  pageSize: PropTypes.number
};
