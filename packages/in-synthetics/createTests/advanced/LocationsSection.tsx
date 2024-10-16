/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { ReactNode } from 'react';

import { SyntheticLocation } from '@instana/types/typeDefinitions';
import { Observable } from '@instana/observables';
import { t } from '@instana/i18n-react';

// eslint-disable-next-line no-restricted-imports
import List, { ColumnDefinition, TableActions, leftHeaderWithSelectAll } from 'in-settings/components/List';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-synthetics/createTests/advanced/LocationsSection.mless';

export interface LocationsListProps {
  setTitle: boolean;
  tableActions?: TableActions<SyntheticLocation>;
  loadEntities: () => Observable<SyntheticLocation[]>;
  noDataMessage?: string;
  renderNoDataAvailable?: (message?: string) => React.ReactNode;
  hiddenIds?: string[];
  pageSize?: number;
  rightHeader: ReactNode;
  isSearchable?: boolean;
  onRowClick?: (entity: any) => void;
  inSelectListDialog?: boolean;
  getHeader?: (
    totalHitsBeforeFilter: number,
    totalHitsAfterFilter: number,
    entitiesBeforePagination: number
  ) => ReactNode;
}

export default function LocationsSection({
  setTitle = true,
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
}: LocationsListProps): JSX.Element {
  return (
    <List<SyntheticLocation>
      title={setTitle ? t('in-synthetics:dialog.createTest.advancedMode.locationsLabel') : null}
      getHeader={defaultGetHeader(inSelectListDialog, tableActions)}
      columnDefinitions={columnDefinitions()}
      tableActions={tableActions}
      loadEntities={loadEntities}
      noDataMessage={noDataMessage}
      renderNoDataAvailable={renderNoDataAvailable}
      pageSize={pageSize}
      initialOrderBy="label"
      rightHeader={rightHeader}
      isSearchable={isSearchable}
      searchAttributes={['label']}
      extraFilters={createFilters(hiddenIds ?? [])}
      searchPlaceholder={t('in-settings:tabs.filter')}
      onRowClick={onRowClick}
      withBottomPadding
    />
  );
}

export function columnDefinitions(): Array<ColumnDefinition<SyntheticLocation>> {
  return [
    {
      id: 'location_name',
      label: t('in-synthetics:dashboard.locationList.locationLabel'),
      width: 50,
      getContent(entity: SyntheticLocation) {
        return (
          <Tooltip content={entity.label} align="topLeft" delay={500}>
            <span className={locals.label}>{entity.label}</span>
          </Tooltip>
        );
      },
      getValue(entity: SyntheticLocation) {
        return entity.label;
      }
    },
    {
      id: 'display_name',
      label: t('in-synthetics:dashboard.locationList.locationDisplayLabel'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticLocation) {
        return (
          <div>
            <div className={locals.label}>{entity.displayLabel}</div>
          </div>
        );
      }
    },
    {
      id: 'status',
      label: t('in-synthetics:dashboard.locationList.status'),
      defaultOrderDirection: 'ASC',
      getContent(entity: SyntheticLocation) {
        return <span className={locals.label}>{entity.status}</span>;
      }
    }
  ];
}

function defaultGetHeader(inSelectListDialog: boolean, tableActions: TableActions<SyntheticLocation>) {
  return leftHeaderWithSelectAll(
    t('in-synthetics:dialog.createTest.advancedMode.locationsLabel'),
    inSelectListDialog,
    tableActions
  );
}

function createFilters(
  hiddenIds: string[]
): Array<(element: SyntheticLocation, index: number, array: SyntheticLocation[]) => boolean> {
  if (hiddenIds) {
    return [
      (entity: SyntheticLocation) => {
        return entity?.id ? hiddenIds.indexOf(entity?.id) < 0 : false;
      }
    ];
  }
  return [];
}
