import { get } from 'lodash';
import React from 'react';

import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import WithSubscript from 'in-settings/components/WithSubscript';
import { getK8sClusters } from 'in-api/permissionSets';

import locals from './K8sClusters.mless';

export default function K8sClusters({
  setTitle = true,
  scrollWrapperClassName,
  tableActions = defaultTableActions,
  loadEntities,
  noDataMessage,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  hasRowNavigation = false,
  inSelectListDialog = false,
  getHeader = defaultGetHeader(inSelectListDialog, tableActions)
}) {
  return (
    <List
      title={setTitle ? ' Permitted Kubernetes Clusters' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getK8sClusters}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="cluster.label"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['cluster.label', 'cluster.distributionType']}
      extraFilters={createFilters(hiddenIds)}
      searchPlaceholder="Filter…"
      onRowClick={onRowClick}
      getDetailsHref={null}
    />
  );
}

function columnDefinitions() {
  return [
    {
      id: 'label',
      label: 'Name',
      width: 30,
      ellipsis: true,
      getContent(entity) {
        const distributionType = get(entity, ['cluster', 'distributionType'], 'Kubernetes');
        return (
          <WithSubscript subscript={distributionType}>
            <span className={locals.ellipsis}>{get(entity, ['cluster', 'label'], '-')}</span>
          </WithSubscript>
        );
      },
      getValue(entity) {
        return entity.id;
      }
    }
  ];
}

const defaultTableActions = {};

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll('Access Kubernetes Clusters', inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `Kubernetes Cluster "${entity.id}"`;
}

export function noRightHeader() {
  // Used to explicitly disable that default right header when this is used in a
  // dialog to select kubernetes clusters in the access permission set form. Reason: The create-new button would navigate away from
  // the edit form in which's context the dialog is shown, thus the user would lose all their unsaved edits.
  return null;
}

function createFilters(hiddenIds) {
  const filters = [];
  if (hiddenIds) {
    filters.push(entity => hiddenIds.indexOf(entity.id) < 0);
  }
  return filters;
}
