import React from 'react';

import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import { getWebsites } from 'in-api/permissionSets';

import locals from './Websites.mless';

export default function Websites({
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
      title={setTitle ? ' Permitted Websites ' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getWebsites}
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
      id: 'label',
      label: 'Name',
      width: 100,
      ellipsis: true,
      getContent(entity) {
        return <span className={locals.ellipsis}>{entity.name}</span>;
      },
      getValue(entity) {
        return entity.id;
      }
    }
  ];
}

const defaultTableActions = {};

function defaultGetHeader(inSelectListDialog, tableActions) {
  return leftHeaderWithSelectAll('Access Websites', inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `Websites "${entity.name}"`;
}

export function noRightHeader() {
  // Used to explicitly disable that default right header when this is used in a
  // dialog to select websites in the access permission set form. Reason: The create-new button would navigate away from
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
