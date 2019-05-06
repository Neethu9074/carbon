import React from 'react';

import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import { getApplicationConfigs } from 'in-api/applicationConfigs';
import WithSubscript from 'in-settings/components/WithSubscript';

import locals from './Applications.mless';

export default function Applications({
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
      title={setTitle ? ' Permitted Applications' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getApplicationConfigs}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="label"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['label']}
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
      width: 100,
      ellipsis: true,
      getContent(entity) {
        return (
          <WithSubscript
            subscript={
              (entity.scope === 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING' ? 'All ' : 'No ') +
              'Downstream Services'
            }
          >
            <span className={locals.ellipsis}>{entity.label}</span>
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
  return leftHeaderWithSelectAll('Applications', inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `Application "${entity.label}"`;
}

export function noRightHeader() {
  // Used to explicitly disable that default right header when this is used in a
  // dialog to select applications in the access permission set form. Reason: The create-new button would navigate away from
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
