/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { GroupPermissionEntity } from '@instana/types';
import { Tooltip } from '@instana/components';

import List, { ColumnDefinition, leftHeaderWithSelectAll, TableActions } from 'in-settings/components/List';
import { AssociatedEntitiesListProps } from 'in-synthetics/utils/constants';
import { t } from 'in-i18n';

export default function AssociatedEntitiesList({
  title,
  tableActions = {},
  loadEntities,
  noDataMessage,
  renderNoDataAvailable,
  hiddenIds,
  pageSize = 20,
  rightHeader,
  isSearchable = true,
  onRowClick,
  inSelectListDialog = false
}: AssociatedEntitiesListProps) {
  const getColumnDefinitions = (): Array<ColumnDefinition<GroupPermissionEntity>> => [
    {
      id: 'name',
      label: t('in-synthetics:dialog.createTest.associations.entityName'),
      defaultOrderDirection: 'ASC',
      getContent(entity: GroupPermissionEntity) {
        return (
          <Tooltip content={entity.name} align="topLeft" delay={500}>
            <span>{entity.name}</span>
          </Tooltip>
        );
      },
      getValue(entity: GroupPermissionEntity) {
        return entity.name;
      }
    }
  ];

  return (
    <List<GroupPermissionEntity>
      getHeader={defaultGetHeader(title, inSelectListDialog, tableActions)}
      columnDefinitions={getColumnDefinitions()}
      tableActions={tableActions}
      loadEntities={loadEntities}
      noDataMessage={noDataMessage}
      renderNoDataAvailable={renderNoDataAvailable}
      pageSize={pageSize}
      initialOrderBy="name"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['name']}
      extraFilters={createFilters(hiddenIds ?? [])}
      searchPlaceholder={t('in-settings:tabs.filter')}
      onRowClick={onRowClick}
      withBottomPadding
    />
  );
}

function defaultGetHeader(
  title: string,
  inSelectListDialog: boolean,
  tableActions: TableActions<GroupPermissionEntity>
) {
  return leftHeaderWithSelectAll(title, inSelectListDialog, tableActions);
}

function createFilters(
  hiddenIds: string[]
): Array<(element: GroupPermissionEntity, index: number, array: GroupPermissionEntity[]) => boolean> {
  if (hiddenIds) {
    return [
      (entity: GroupPermissionEntity) => {
        return entity?.id ? hiddenIds.indexOf(entity?.id) < 0 : false;
      }
    ];
  }
  return [];
}
