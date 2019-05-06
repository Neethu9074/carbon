import React from 'react';

import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import WithSubscript from 'in-settings/components/WithSubscript';
import { getPermissionSets } from 'in-api/permissionSets';

import locals from './PermissionSets.mless';

export default function PermissionSets({
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
      title={setTitle ? 'Access Scopes' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getPermissionSets}
      noDataMessage={noDataMessage}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name']}
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
      id: 'name',
      label: 'Name',
      width: 100,
      ellipsis: true,
      getContent(entity) {
        return (
          <WithSubscript subscript={entity.applicationIds.length + ' Applications'}>
            <span className={locals.ellipsis}>{entity.name}</span>
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
  return leftHeaderWithSelectAll('Access Scopes', inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `Access Scope "${entity.name}"`;
}

export function noRightHeader() {
  // Used to explicitly disable that default right header when this is used in a
  // dialog to select permissionSets in the access permissionSet form. Reason: The create-new button would navigate away from
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
