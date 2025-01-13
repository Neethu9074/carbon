/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/SimpleListNameColumn';
import ListDeselectionColumn from 'in-alerting/smart-alerts/applications/list/columns/ListDeselectionColumn';
import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/list/columns/EvaluationTypeColumn';
import ListEntityNameColumn from 'in-alerting/smart-alerts/applications/list/columns/ListEntityNameColumn';
import ListSelectionColumn from 'in-alerting/smart-alerts/applications/list/columns/ListSelectionColumn';
import { ListActionsColumn } from 'in-alerting/smart-alerts/components/list/columns/ListActionsColumn';
import ListFilterColumn from 'in-alerting/smart-alerts/applications/list/columns/ListFiltersColumn';
import { ListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/ListNameColumn';
import TableNameColumnCell from 'in-alerting/smart-alerts/components/table/TableNameColumnCell';
import { getSubtitle } from 'in-alerting/smart-alerts/applications/list/columns/ListNameColumn';
import { actionHandlers } from 'in-alerting/smart-alerts/applications/list/ListActionHandlers';
import { createRowLinkLocation } from 'in-alerting/smart-alerts/applications/list/rowLinking';
import StatusColumnCell from 'in-alerting/smart-alerts/components/list/StatusColumnCell';
import { fromBackendModel } from 'in-components/QueryBuilder/transformation/formModel';
import { isCategoryGlobal } from 'in-alerting/smart-alerts/components/list/constants';
import { ListSubtitle } from 'in-alerting/smart-alerts/components/list/ListSubtitle';
import { TableCellWrapper } from 'in-alerting/components/TableCellWrapper';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/list/columns/ListColumns.mless';

/**
 * Primary Columns
 * Only one primary column per list should be used
 */
/* Primary column with icon, blueprint and name linking to details */
export function linkedListNameColumnDefinition(width = '35%') {
  return {
    id: 'name',
    label: t('in-alerting:smartAlerts.sortOptions.name'),
    width,
    sortable: false,
    getContent({ config }) {
      return <ListNameColumn config={config} />;
    }
  };
}

/* Primary column with icon, blueprint and name */
export function simpleListNameColumnDefinition(width = '35%') {
  return {
    id: 'name',
    label: t('in-alerting:smartAlerts.sortOptions.name'),
    width,
    sortable: true,
    getContent({ config }) {
      return <SimpleListNameColumn config={config} />;
    },
    getValue({ config }) {
      return config?.name;
    }
  };
}

/**
 * Details Columns
 */
/* Details column informing about evaluation type and global/local alert type */
export function evaluationInfoColumnDefinition(params = {}) {
  const { width = '15%', isGlobalSmartAlertConfig = false } = params;
  return {
    id: 'evaluationInfo',
    label: t('in-alerting:smartAlerts.sortOptions.type'),
    sortable: false,
    width,
    getContent({ config }) {
      return <EvaluationTypeColumn config={config} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />;
    }
  };
}

/* Details column informing about the entities this alert is scoped on */
export function entityNameColumnDefinition(params = {}) {
  const { width = '30%', isGlobalSmartAlertConfig = false } = params;
  return {
    id: 'entityName',
    width,
    sortable: false,
    getContent({ config }) {
      const { tagFilterExpression, rule, threshold } = config;
      const backendModelTagFilterExpression = fromBackendModel(tagFilterExpression);
      const widthClass = backendModelTagFilterExpression.length > 0 ? locals.maxWidth70 : locals.maxWidth100;
      return (
        <div className={locals.filters}>
          <span className={classNames(locals.centered, locals.space, widthClass)}>
            <ListEntityNameColumn {...config} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />
          </span>
          {backendModelTagFilterExpression.length > 0 && (
            <span className={locals.centered}>
              <ListFilterColumn
                tagFilterExpression={backendModelTagFilterExpression}
                rule={rule}
                threshold={threshold}
              />
            </span>
          )}
        </div>
      );
    }
  };
}

/**
 * Actions
 * Only one actions column per list should be used
 */
/* Actions column allowing to edit the alert configuration */
export function editActionsColumnDefinition(params = {}) {
  const { width = '15%', actionHandlers } = params;
  return {
    id: 'actions',
    sortable: false,
    width,
    getContent({ config, loading }) {
      return <ListActionsColumn config={config} isLoading={loading} actionHandlers={actionHandlers} />;
    }
  };
}

/* Action column allowing to select the alert configuration */
export function selectActionColumnDefinition(selection, onSelect, width) {
  return {
    id: 'actions',
    sortable: false,
    width,
    getContent({ config }) {
      return <ListSelectionColumn selection={selection} onSelect={onSelect} config={config} />;
    }
  };
}

export function deselectActionColumnDefinition(onDeselect, width) {
  return {
    id: 'actions',
    sortable: false,
    width,
    getContent({ config }) {
      return <ListDeselectionColumn onDeselect={onDeselect} config={config} />;
    }
  };
}

// function to display subtitle in carbon table
export function getEntityNameAsSubtitle(config, isGlobalSmartAlertConfig) {
  if (!isGlobalSmartAlertConfig) {
    return;
  }
  const { applicationIds } = config;
  const label = t('in-alerting:smartAlerts.applications.inventory.numberOfApplicationsSelected', {
    count: applicationIds.length
  });
  return <ListSubtitle label={label} icon={'lib_application'} />;
}

export function createTableColumnDefinition(configsCategory, trackCta) {
  const isGlobalSmartAlertConfig = isCategoryGlobal(configsCategory);
  const showActionButtons = isGlobalSmartAlertConfig
    ? role.canConfigureGlobalApplicationSmartAlerts
    : role.canConfigureApplicationSmartAlerts;

  const nameColumn = {
    id: 'name',
    label: t('in-alerting:smartAlerts.list.columns.name'),
    sortable: true,
    ellipsis: '30vw',
    getContent: config => (
      <TableNameColumnCell
        config={config}
        getNameSubtitle={(config, isGlobalSmartAlertConfig) =>
          getEntityNameAsSubtitle(config, isGlobalSmartAlertConfig)
        }
        createRowLinkLocation={createRowLinkLocation(configsCategory)}
        isCategoryGlobal={isGlobalSmartAlertConfig}
      />
    )
  };

  const triggeringAction = {
    id: 'triggering-action',
    label: t('in-alerting:table.triggeringAction'),
    ellipsis: '25vw',
    getContent: config => <TableCellWrapper>{getSubtitle(config.rule, config.threshold)}</TableCellWrapper>,
    sortable: false
  };

  const status = {
    id: 'enabled',
    label: t('in-alerting:table.status'),
    getContent: config => <StatusColumnCell status={config.enabled} />,
    sortable: true
  };
  const actionHandler = {
    id: 'actions',
    sortable: false,
    getContent(config, loading) {
      return (
        showActionButtons && (
          <ListActionsColumn
            config={config}
            isLoading={loading}
            actionHandlers={actionHandlers(isGlobalSmartAlertConfig, trackCta)}
          />
        )
      );
    }
  };
  return [nameColumn, triggeringAction, status, actionHandler];
}
