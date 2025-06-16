/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';
import { isEmpty, isEqual } from 'lodash';

import { CarbonTab, CarbonTabList, CarbonTabPanels } from '@instana/components';
import { CarbonTabs } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import {
  AlertFetchFunction,
  FetchedConfigs,
  getConfigByCategory,
  getSearchResults,
  sortBy
} from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import {
  defaultState,
  SmartAlertsTableViewProps,
  TableState
} from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import {
  categoryGlobal,
  categoryLocal,
  isCategoryGlobal,
  isCategoryLocal
} from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertTablePresenter from 'in-alerting/smart-alerts/components/list/SmartAlertTablePresenter';
import TableSortingConfigurator from 'in-alerting/smart-alerts/components/list/TableSortingConfigurator';
import { refreshSmartAlertConfigsStats } from 'in-events/components/SmartAlerts/Components/SmartAlerts';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { isLoading, success, successObservable } from 'in-services/util/result';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { pendingResult } from 'in-services/fixedObjects';
import { Result } from 'in-types';
import { t } from 'in-i18n';

const pageSizes = [10, 20, 30, 40, 50];

const refreshSignal = create().emit({ emitLatestOnSubscribe: false });

export function refreshSmartAlertConfigsList() {
  refreshSignal.emit(true);
}

export default function SmartAlertsTableView<AlertConfig extends AlertConfigType>({
  getGlobalAlertConfigFetchFunction,
  getLocalAlertConfigsFetchFunction,
  getGlobalAlertConfigTitle,
  getLocalAlertConfigTitle,
  columnDefinitions,
  externalState,
  setExternalState,
  configsCategory = categoryLocal,
  setConfigsCategory,
  extraSearchAttributes = [],
  toolBarContent,
  isSelectable,
  noDataHeader,
  sortOptions,
  noDataDescription
}: SmartAlertsTableViewProps<AlertConfig>) {
  const [{ orderBy, orderDirection, page, query, pageSize }, setState] = useOptionalExternalState(
    externalState,
    setExternalState
  );

  const fetchedGlobalAlerts = useSmartAlertConfigs(getGlobalAlertConfigFetchFunction);
  const fetchedLocalAlerts = useSmartAlertConfigs(getLocalAlertConfigsFetchFunction);

  const [selectedData, setSelectedRows] = useState<string[]>([]);

  const { configs, loading } = getConfigByCategory({
    fetchedGlobalAlerts,
    fetchedLocalAlerts,
    configsCategory
  });

  const { globalSearchResults, localSearchResults } = getSearchResults({
    query,
    fetchedGlobalAlerts,
    fetchedLocalAlerts,
    extraSearchAttributes
  });

  let searchResultsSelected: AlertConfigType[] = configs;
  if (isCategoryGlobal(configsCategory)) {
    searchResultsSelected = globalSearchResults;
  }
  if (isCategoryLocal(configsCategory)) {
    searchResultsSelected = localSearchResults;
  }

  const hasSingleCategory = !getGlobalAlertConfigFetchFunction || !setConfigsCategory || !getGlobalAlertConfigTitle;

  useEffect(() => {
    if (!loading) {
      setState({ page: 1 });
      // resetting to page 1 only on change of specific props
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const offset = (page - 1) * Number(pageSize);
  const until = offset + Number(pageSize);

  const [listItems, setListItems] = useState<AlertConfigType[]>([]);

  useEffect(() => {
    if (!loading) {
      const items = [...searchResultsSelected].sort(sortBy(orderBy, orderDirection)).slice(offset, until);
      if (!isEqual(listItems, items)) {
        setListItems(items);
        refreshSmartAlertConfigsStats(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultsSelected, loading, orderBy, orderDirection, page, pageSize]);

  if (loading) {
    return <LoadingList numSkeletonRows={3} />;
  }
  const defaultSelectedIndex = isCategoryGlobal(configsCategory) ? 0 : 1;

  const serverTableList = (
    <SmartAlertTablePresenter
      cardTitle={hasSingleCategory ? getLocalAlertConfigTitle(localSearchResults.length || 0) : undefined}
      columnDefinitions={columnDefinitions}
      result={getListItems(searchResultsSelected.length, listItems, pageSize)}
      orderBy={orderBy}
      orderDirection={orderDirection}
      page={page}
      query={query}
      pageSize={pageSize}
      pageSizes={pageSizes}
      onChange={(data: Partial<TableState>) => {
        setState({
          page: data.page ?? page,
          orderBy: !isEmpty(data.orderBy) ? data.orderBy : orderBy,
          orderDirection: data.orderDirection,
          query: data.query ?? query,
          pageSize: data.pageSize ?? pageSize
        });
      }}
      toolBarContent={
        <>
          <TableSortingConfigurator
            options={sortOptions}
            orderBy={{
              by: orderBy,
              direction: orderDirection
            }}
            onChange={({ by, direction }) =>
              setState({
                orderBy: by,
                orderDirection: direction
              })
            }
          />
          {toolBarContent}
        </>
      }
      allRowSelected={selectedData.length > 0 && selectedData.length === listItems.length}
      rowSelected={selectedData}
      handleSelectAll={() => handleSelectAll(selectedData, setSelectedRows, listItems)}
      handleRowSelect={(row: RowProps) => handleRowSelect(row, selectedData, setSelectedRows)}
      handleToolBarActionCancel={() => handleToolBarActionCancel(setSelectedRows)}
      isSearchable
      isSelectable={isSelectable}
      noDataHeader={noDataHeader}
      noDataDescription={noDataDescription}
      searchPlaceholderText={t('in-alerting:table.searchPlaceholder')}
    />
  );

  return (
    <>
      <ViewTrackingMeta
        data={{
          pagePath: location?.pathname
        }}
      />

      {!hasSingleCategory ? (
        <CarbonTabs defaultSelectedIndex={defaultSelectedIndex}>
          <CarbonTabList aria-label="Smart alert" contained>
            <CarbonTab
              onClick={() => {
                setState({ page: 1 });
                setConfigsCategory(categoryGlobal);
              }}
              secondaryLabel={(globalSearchResults.length || 0).toString()}
            >
              {getGlobalAlertConfigTitle(0)}
            </CarbonTab>
            <CarbonTab
              onClick={() => {
                setState({ page: 1 });
                setConfigsCategory(categoryLocal);
              }}
              secondaryLabel={(localSearchResults.length || 0).toString()}
            >
              {getLocalAlertConfigTitle(0)}
            </CarbonTab>
          </CarbonTabList>
          <CarbonTabPanels>{serverTableList}</CarbonTabPanels>
        </CarbonTabs>
      ) : (
        <>{serverTableList}</>
      )}
    </>
  );
}

// function to transform the alertConfig to carbon table acceptable form
function getListItems(searchResultsSelectedLength: number, items: AlertConfigType[], pageSize: number) {
  return success(
    {
      items: items,
      pageSize: pageSize,
      page: 0,
      totalHits: searchResultsSelectedLength
    },
    Date.now()
  );
}

function handleSelectAll(
  selectedData: string[],
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>,
  listItems: AlertConfigType[]
) {
  if (selectedData.length < listItems.length) {
    // If not all are selected, select all
    const allRowIds = listItems.map(row => row.id);
    setSelectedRows(allRowIds);
  } else {
    // If all are selected, deselect all
    setSelectedRows([]);
  }
}

export interface RowProps {
  cells: object[];
  disabled: boolean;
  id: string;
  isExpanded: boolean;
  isSelected: boolean;
}

function handleRowSelect(
  row: RowProps,
  selectedData: string[],
  setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>
) {
  const revisedSelectedData = selectedData.includes(row.id)
    ? selectedData.filter(id => id !== row.id)
    : [...selectedData, row.id];

  setSelectedRows(revisedSelectedData);
}

function handleToolBarActionCancel(setSelectedRows: React.Dispatch<React.SetStateAction<string[]>>) {
  setSelectedRows([]);
}

function useOptionalExternalState(externalState: TableState, setExternalState: (state: Partial<TableState>) => void) {
  const [state, defaultSetState] = useState(defaultState);
  const setState = (newState: Partial<TableState>) => defaultSetState({ ...state, ...newState });
  if (setExternalState) {
    return [externalState, setExternalState] as const;
  }
  return [state, setState] as const;
}

export function useSmartAlertConfigs<AlertConfig extends AlertConfigType>(
  getAlertConfigFetchFunction: AlertFetchFunction<AlertConfig> = () => successObservable<AlertConfig[]>([])
): FetchedConfigs<AlertConfig> {
  const result =
    useObservable(() => {
      return refreshSignal.flatMap(getAlertConfigFetchFunction);
    }, []) ?? (pendingResult as Result<AlertConfig[]>);

  return {
    configs: result?.data ?? [],
    isLoading: isLoading(result),
    errors: result?.errors
  };
}
