/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SimpleListNameColumn } from 'in-alerting/smart-alerts/applications/components/list/columns/SimpleListNameColumn';
import ListDeselectionColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListDeselectionColumn';
import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/components/list/columns/EvaluationTypeColumn';
import ListEntityNameColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListEntityNameColumn';
import ListSelectionColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListSelectionColumn';
import ListActionsColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListActionsColumn';
import ListFilterColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListFiltersColumn';
import { ListNameColumn } from 'in-alerting/smart-alerts/applications/components/list/columns/ListNameColumn';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

/**
 * Primary Columns
 * Only one primary column per list should be used
 */
/* Primary column with icon, blueprint and name linking to details */
export function linkedListNameColumnDefinition(location, additionalMatrixKeysProvider, width = '35%') {
  return {
    id: 'name',
    label: t('in-alerting:smartAlerts.sortOptions.name'),
    width,
    sortable: false,
    getContent({ config, configsCategory }) {
      return (
        <ListNameColumn
          config={config}
          configsCategory={configsCategory}
          additionalMatrixKeys={additionalMatrixKeysProvider}
          goToGlobalAlertDetails={location?.pathname === '/alerts'}
        />
      );
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
export function evaluationInfoColumnDefinition(width = '20%') {
  return {
    id: 'evaluationInfo',
    label: t('in-alerting:smartAlerts.sortOptions.type'),
    sortable: false,
    width,
    getContent({ config, isGlobalSmartAlertConfig }) {
      return <EvaluationTypeColumn config={config} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />;
    }
  };
}

/* Details column informing about the entities this alert is scoped on */
export function entityNameColumnDefinition(width = '25%') {
  return {
    id: 'entityName',
    width,
    sortable: false,
    getContent({ config, isGlobalSmartAlertConfig }) {
      return <ListEntityNameColumn {...config} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />;
    }
  };
}

/* Details column informing about the filters applied to this alert */
export function filtersColumnDefinition(width) {
  return {
    id: 'filters',
    sortable: false,
    width,
    getContent({ config }) {
      return <ListFilterColumn {...config} />;
    }
  };
}

/**
 * Actions
 * Only one actions column per list should be used
 */
/* Actions column allowing to edit the alert configuration */
export function editActionsColumnDefinition(width) {
  return {
    id: 'actions',
    sortable: false,
    width,
    getContent({ config, loading, isGlobalSmartAlertConfig }) {
      return (
        role.canConfigureCustomAlerts && (
          <ListActionsColumn config={config} isLoading={loading} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />
        )
      );
    }
  };
}

/* Action column allowing to select the alert configuration */
export function selectActionColumnDefinition(selection, onSelect, width) {
  return {
    id: 'actions',
    sortable: false,
    width,
    getContent({ config, isGlobalSmartAlertConfig }) {
      return (
        <ListSelectionColumn
          selection={selection}
          onSelect={onSelect}
          config={config}
          isGlobalSmartAlertConfig={isGlobalSmartAlertConfig}
        />
      );
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
