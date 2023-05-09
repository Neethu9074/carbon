/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  evaluationInfoColumnDefinition,
  simpleListNameColumnDefinition,
  selectActionColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/applications/list/constants';
import SmartAlertsBaseList from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList';
import { getMetricName } from 'in-alerting/smart-alerts/applications/list/listHelper';

/* Application specific selection list */
export default function SmartAlertSelectionList({
  onNoData,
  selection = [],
  onChange,
  getGlobalAlertConfigFetchFunction,
  getLocalAlertConfigsFetchFunction,
  pageSize
}) {
  const [configsCategory, setConfigsCategory] = useState(categoryLocal);

  return (
    <SmartAlertsBaseList
      onNoData={onNoData}
      configsCategory={configsCategory}
      setConfigsCategory={setConfigsCategory}
      getLocalAlertConfigsFetchFunction={getLocalAlertConfigsFetchFunction}
      getGlobalAlertConfigFetchFunction={getGlobalAlertConfigFetchFunction}
      columnDefinitions={getColumnDefinitions(selection, onChange, isCategoryGlobal(configsCategory))}
      sortOptions={sortOptions}
      extraSearchAttributes={[getMetricName]}
      pageSize={pageSize}
    />
  );
}

function getColumnDefinitions(selection, onChange, isGlobalSmartAlertConfig) {
  return [
    selectActionColumnDefinition(selection, (id, state) => {
      if (state) {
        onChange([...selection, id]);
      } else {
        onChange(selection.filter(i => i !== id));
      }
    }),
    simpleListNameColumnDefinition('70%'),
    evaluationInfoColumnDefinition({ width: '25%', isGlobalSmartAlertConfig })
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
