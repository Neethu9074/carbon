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
  const { width = '20%', isGlobalSmartAlertConfig = false } = params;
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
      return (
        <div className={locals.filters}>
          <span className={classNames(locals.centered, locals.space)}>
            <ListEntityNameColumn {...config} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />
          </span>
          <span className={locals.centered}>
            <ListFilterColumn {...config} />
          </span>
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
  const { width, actionHandlers } = params;
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
