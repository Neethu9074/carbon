/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { selectActionColumnDefinition } from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import { categoryLocal, isCategoryGlobal, sortOptions } from 'in-alerting/smart-alerts/components/list/constants';
import { getEntityNameAsSubtitle } from 'in-alerting/smart-alerts/applications/list/columns/columnDefinitions';
import SmartAlertsTableView from 'in-alerting/smart-alerts/components/list/SmartAlertsTableView';
import TableNameColumnCell from 'in-alerting/smart-alerts/components/table/TableNameColumnCell';
import { getSubtitle } from 'in-alerting/smart-alerts/applications/list/columns/ListNameColumn';
import { getMetricName } from 'in-alerting/smart-alerts/applications/list/listHelper';
import { TableCellWrapper } from 'in-alerting/components/TableCellWrapper';
import { t } from 'in-i18n';

/* Application specific selection list */
export default function SmartAlertSelectionList({
  selection = [],
  onChange,
  getGlobalAlertConfigFetchFunction,
  getLocalAlertConfigsFetchFunction,
  pageSize
}) {
  const [configsCategory, setConfigsCategory] = useState(categoryLocal);

  return (
    <SmartAlertsTableView
      noDataHeader={
        isCategoryGlobal(configsCategory)
          ? t('in-alerting:smartAlerts.applications.inventory.noGlobalAlertDataHeader')
          : t('in-alerting:smartAlerts.applications.inventory.noLocalAlertDataHeader')
      }
      noDataDescription={t('in-alerting:smartAlerts.titleNoSmartAlertsConfiguredFound')}
      configsCategory={configsCategory}
      setConfigsCategory={setConfigsCategory}
      getLocalAlertConfigsFetchFunction={getLocalAlertConfigsFetchFunction}
      getGlobalAlertConfigFetchFunction={getGlobalAlertConfigFetchFunction}
      getLocalAlertConfigTitle={() => t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsTable')}
      getGlobalAlertConfigTitle={() => t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsTable')}
      columnDefinitions={createTableColumnDefinition(configsCategory, selection, onChange)}
      sortOptions={sortOptions}
      extraSearchAttributes={[getMetricName]}
      pageSize={pageSize}
    />
  );
}

function createTableColumnDefinition(configsCategory, selection, onChange) {
  const isGlobalSmartAlertConfig = isCategoryGlobal(configsCategory);

  const selectApplication = selectActionColumnDefinition(selection, (id, state) => {
    if (state) {
      onChange([...selection, id]);
    } else {
      onChange(selection.filter(i => i !== id));
    }
  });

  const NameColumn = {
    id: 'name',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    sortable: true,
    ellipsis: '30vw',
    getContent: config => {
      return (
        <TableNameColumnCell
          config={config}
          getNameSubtitle={(config, isGlobalSmartAlertConfig) =>
            getEntityNameAsSubtitle(config, isGlobalSmartAlertConfig)
          }
          createRowLinkLocation={undefined}
          isCategoryGlobal={isGlobalSmartAlertConfig}
        />
      );
    }
  };

  const triggeringAction = {
    id: 'triggering-action',
    label: t('in-alerting:table.triggeringAction'),
    ellipsis: '25vw',
    getContent: config => <TableCellWrapper>{getSubtitle(config.rule, config.threshold)}</TableCellWrapper>,
    sortable: false
  };

  return [selectApplication, NameColumn, triggeringAction];
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
