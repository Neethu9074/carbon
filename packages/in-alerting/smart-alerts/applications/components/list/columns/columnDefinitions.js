/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/components/list/columns/EvaluationTypeColumn';
import ListEntityNameColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListEntityNameColumn';
import ListActionsColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListActionsColumn';
import ListFilterColumn from 'in-alerting/smart-alerts/applications/components/list/columns/ListFiltersColumn';
import { ListNameColumn } from 'in-alerting/smart-alerts/applications/components/list/columns/ListNameColumn';
import { role } from 'in-stores/user';

/**
 * Primary Columns
 * Only one primary column per list should be used
 */
/* Primary column with icon, blueprint and name linking to details */
export function linkedListNameColumnDefinition(location, additionalMatrixKeysProvider) {
  return {
    id: 'name',
    width: '35%',
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

/**
 * Details Columns
 */
/* Details column informing about evaluation type and global/local alert type */
export function evaluationInfoColumnDefinition() {
  return {
    id: 'evaluationInfo',
    sortable: false,
    width: '20%',
    getContent({ config }) {
      return <EvaluationTypeColumn {...config} />;
    }
  };
}

/* Details column informing about the entities this alert is scoped on */
export function entityNameColumnDefinition() {
  return {
    id: 'entityName',
    width: '25%',
    sortable: false,
    getContent({ config, isGlobalSmartAlertConfig }) {
      return <ListEntityNameColumn {...config} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />;
    }
  };
}

/* Details column informing about the filters applied to this alert */
export function filtersColumnDefinition() {
  return {
    id: 'filters',
    sortable: false,
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
export function editActionsColumnDefinition() {
  return {
    id: 'actions',
    sortable: false,
    getContent({ config, loading, isGlobalSmartAlertConfig }) {
      return (
        role.canConfigureCustomAlerts && (
          <ListActionsColumn config={config} isLoading={loading} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />
        )
      );
    }
  };
}
