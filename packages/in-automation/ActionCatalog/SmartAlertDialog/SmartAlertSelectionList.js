/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import {
  evaluationInfoColumnDefinition,
  simpleListNameColumnDefinition,
  selectActionColumnDefinition
} from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/applications/list/constants';
import SmartAlertsBaseList from 'in-automation/ActionCatalog/SmartAlertDialog/SmartAlertsBaseList';
import { getMetricName } from 'in-alerting/smart-alerts/applications/list/listHelper';

/* Application specific selection list */
export default function SmartAlertSelectionList({
  onNoData,
  selection = [],
  onChange,
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
