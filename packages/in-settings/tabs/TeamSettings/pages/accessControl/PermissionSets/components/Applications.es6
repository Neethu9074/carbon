import React from 'react';

import List, { leftHeaderWithSelectAll } from 'in-settings/components/List';
import WithSubscript from 'in-settings/components/WithSubscript';
import { getApplications } from 'in-api/permissionSets';

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
      title={setTitle ? ' Permitted Application Perspectives' : null}
      getHeader={getHeader}
      getEntityName={getEntityName}
      columnDefinitions={columnDefinitions(hasRowNavigation)}
      scrollWrapperClassName={scrollWrapperClassName}
      tableActions={tableActions}
      loadEntities={loadEntities ? loadEntities : getApplications}
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
              entity.scope === 'INCLUDE_ALL_DOWNSTREAM'
                ? 'All Downstream Services'
                : entity.scope === 'INCLUDE_NO_DOWNSTREAM'
                  ? 'No Downstream Services'
                  : 'Immediate Database And Messaging Services'
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
  return leftHeaderWithSelectAll('Access Application Perspectives', inSelectListDialog, tableActions);
}

function getEntityName(entity) {
  return `Application Perspective "${entity.label}"`;
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
