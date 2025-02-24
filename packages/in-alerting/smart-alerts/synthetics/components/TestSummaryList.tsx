/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import { noop } from 'lodash';

import { PaginatedResult, Result, SyntheticTest, TestResultListItem } from '@instana/types';
import { IconButton, Checkbox } from '@instana/components';
import { useObservable } from '@instana/hooks';

import {
  columnDefinitions,
  TestListProps,
  TestResultListItemId
} from 'in-alerting/smart-alerts/synthetics/components/columnDefinitions';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
import Filters from 'in-synthetics/dashboards/global/tabs/tests/components/Filters';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import NoItemSelected from 'in-alerting/smart-alerts/components/NoItemSelected';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import { ColumnDefinition } from 'in-components/tables/ServerTable/types';
import { TrProps } from 'in-components/tables/ServerTable/types';
import { pendingResult } from 'in-services/fixedObjects';
import { isLoading } from 'in-services/util/result';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getTests } from 'in-synthetics/api';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-settings/components/List.mless';

export interface StateProps {
  query: string;
  syntheticTypes: string[];
  locationIds: string[];
  applicationIds: string[];
  page: number;
  orderBy: string;
  orderDirection: string;
}

export interface TableActions<ItemType extends Object> {
  deselect?: {
    deselect: (entity: ItemType) => void;
  };
  selectCheckbox?: {
    selectCheckbox: (entity: ItemType) => void;
    get: (entity: ItemType) => boolean;
  };
  disabled?: (entity: ItemType) => boolean;
  get?: (entity: ItemType) => boolean;
  toggle?: (entity: ItemType) => void;
}

let defaultState: StateProps = {
  query: '',
  syntheticTypes: [],
  locationIds: [],
  applicationIds: [],
  page: 1,
  orderBy: 'successRate',
  orderDirection: 'ASC'
};

const pageSize = 5;

export default function TestSummaryList({
  tableActions,
  hiddenIds
}: {
  tableActions: TableActions<any>;
  hiddenIds: string[];
}) {
  const [state, setState] = useState(defaultState);

  return (
    <SummaryList externalState={state} setExternalState={setState} tableActions={tableActions} hiddenIds={hiddenIds} />
  );
}

export function SummaryList({
  externalState,
  setExternalState,
  tableActions,
  hiddenIds
}: {
  externalState: StateProps;
  setExternalState: any;
  tableActions: TableActions<any>;
  hiddenIds: string[];
}) {
  const timeConfig = useTimeConfig();

  const [state, setState] = useOptionalExternalState(externalState, setExternalState);
  const syntheticTests: Result<SyntheticTest[]> = useObservable<any, any[]>(() => getTests(), []) ?? pendingResult;

  const list: Result<PaginatedResult<TestResultListItem>> = useObservable<any, any[]>(
    () =>
      getTestSummaryListData({
        timeConfig,
        orderBy: state.orderBy ?? 'successRate',
        orderDirection: state.orderDirection ?? 'ASC',
        page: state.page ?? 1,
        pageSize: pageSize,
        query: state.query ?? '',
        context: '',
        syntheticTypes: state.syntheticTypes ?? [],
        locationIds: state.locationIds ?? [],
        applicationIds: state.applicationIds ?? [],
        progress: { loading: true },
        excludeIds: hiddenIds
      }),
    [
      state.syntheticTypes,
      state.locationIds,
      state.applicationIds,
      state.page,
      state.timeQuery,
      state.orderBy,
      state.orderDirection,
      state.query
    ]
  );

  const listData = addIdToLists(list);

  if (isLoading(listData)) {
    return <LoadingList numSkeletonRows={3} />;
  }

  function setFilters(filter: Partial<StateProps>) {
    const data = { ...state, ...filter };
    setState(data);
  }

  return (
    <ServerTablePresenter<TestResultListItem, TestListProps>
      timeConfig={timeConfig}
      onChange={({ page, query, orderBy, orderDirection }) => {
        const updatedState = { ...state, ...{ page, query, orderBy, orderDirection } };
        setState(updatedState);
      }}
      columnDefinitions={addTableActions({
        columnDefinitions,
        tableActions
      })}
      getRowProps={getRowProps}
      query={state.query}
      page={state.page}
      orderBy={state.orderBy}
      orderDirection={state.orderDirection}
      result={listData}
      noDataMessage={''}
      pageSize={pageSize}
      rightHeader={
        <Filters
          result={syntheticTests}
          setFilter={setFilters}
          syntheticTypes={state.syntheticTypes}
          locationIds={state.locationIds}
          applicationIds={state.applicationIds}
        />
      }
      isSearchable
      searchPlaceholder={t('in-settings:tabs.filter')}
      cardTitle={t('in-alerting:smartAlerts.synthetics.selectTests.alertTests')}
      allRowsAreSelected={areAllRowsOnCurrentPageSelected(listData?.data, tableActions)}
      setSelectedStateForRows={setSelectedStateForRowsOnCurrentPage(listData?.data, tableActions)}
      shadowless
      renderNoDataAvailable={() => (
        <NoItemSelected text={t('in-alerting:smartAlerts.synthetics.selectTests.noTestAvailable')} />
      )}
    />
  );
}

function useOptionalExternalState(externalState: StateProps, setExternalState: any) {
  const [state, defaultSetState] = useState({ ...defaultState, ...externalState });
  const setState = (newState: StateProps) => defaultSetState({ ...state, ...newState });
  if (setExternalState) {
    return [{ ...defaultState, ...externalState }, setExternalState];
  }
  return [state, setState];
}

function addTableActions({
  columnDefinitions,
  tableActions
}: {
  columnDefinitions: ColumnDefinition<TestResultListItem>[];
  tableActions: TableActions<any>;
}) {
  let allColumns = columnDefinitions;

  if (tableActions.deselect) {
    allColumns = addDeselectAction(allColumns, tableActions.deselect);
  }
  if (tableActions.selectCheckbox) {
    allColumns = addSelectCheckboxAction(allColumns, tableActions.selectCheckbox);
  }
  return allColumns;
}

function addDeselectAction(columns: ColumnDefinition<TestResultListItem>[], actionDefinition: any) {
  return columns.concat({
    label: '',
    id: 'deselectAction',
    sortable: false,
    width: '4rem',
    widthInAbsoluteUnit: true,
    getContent(entity: TestResultListItemId) {
      return (
        <Tooltip content={t('in-settings:components.deselect')} delay={500}>
          <IconButton
            kind="primaryv2"
            type={'lib_openclose_remove_circle_outline'}
            onClick={e => {
              stopPropagationAndPreventDefault(e);
              actionDefinition?.deselect(entity);
            }}
          />
        </Tooltip>
      );
    }
  });
}

function addSelectCheckboxAction(columns: ColumnDefinition<TestResultListItem>[], actionDefinition: any) {
  // clone the column definitions array, then insert the checkbox as first column
  columns = columns.slice();
  columns.unshift({
    id: 'selectCheckbox',
    sortable: false,
    headCellProps: {
      className: locals.selectCheckboxHead
    },
    width: '4rem',
    widthInAbsoluteUnit: true,
    selectAllCheckbox: true,
    cellClassName: locals.selectCheckbox,
    label: '',
    getContent(entity: TestResultListItemId) {
      return (
        <Checkbox
          disabled={actionDefinition.disabled?.(entity)}
          checked={actionDefinition.get(entity)}
          onChange={() => {
            actionDefinition.toggle(entity);
          }}
          size="large"
        />
      );
    }
  });
  return columns;
}

function areAllRowsOnCurrentPageSelected(
  entities: PaginatedResult<TestResultListItemId> | undefined,
  tableActions: TableActions<any>
) {
  return areAllRowsSelected(entities?.items, tableActions, 0);
}

function areAllRowsSelected(entities: TestResultListItemId[] | undefined, tableActions: any, startIndex: number) {
  if (!tableActions.selectCheckbox || !entities || entities.length === 0) {
    return false;
  }
  for (let i = startIndex; i < entities?.length; i++) {
    if (!tableActions.selectCheckbox.get(entities[i])) {
      return false;
    }
  }
  return true;
}

function setSelectedStateForRowsOnCurrentPage(
  entities: PaginatedResult<TestResultListItemId> | undefined,
  tableActions: any
) {
  if (!tableActions.selectCheckbox || !entities || entities?.items?.length === 0) {
    return noop;
  }
  return (selected: boolean) => {
    return tableActions.selectCheckbox.setAllOnCurrentPage(entities.items, selected, 1, pageSize);
  };
}

function addIdToLists(list: Result<PaginatedResult<TestResultListItem>>) {
  if (!list?.data?.items) {
    return list;
  }
  const itemsList = list?.data?.items.map((items: TestResultListItem) => {
    return { ...items, id: items?.testResultCommonProperties?.testId };
  });
  return { ...list, data: { ...list.data, items: itemsList } };
}

function getRowProps(): TrProps {
  return {
    className: locals.row,
    size: 'compact'
  };
}
