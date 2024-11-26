/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';

import { CarbonTab, CarbonTabList, CarbonTabPanels } from '@instana/components';
import { CarbonTabs } from '@instana/components';
import { create } from '@instana/observables';

import {
  getConfigByCategory,
  getSearchResults,
  sortBy,
  useOptionalExternalState,
  useSmartAlertConfigs
} from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList';
import {
  categoryGlobal,
  categoryLocal,
  isCategoryGlobal,
  isCategoryLocal
} from 'in-alerting/smart-alerts/components/list/constants';
import { SmartAlertsTableViewProps } from 'in-alerting/smart-alerts/components/list/SmartAlertsTableWithUrlState';
import SmartAlertTablePresenter from 'in-alerting/smart-alerts/components/list/SmartAlertTablePresenter';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { TableState } from 'in-components/tables/ServerTable/types';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

const defaultPageSize = 10;

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
  pageSize = defaultPageSize,
  configsCategory = categoryLocal,
  setConfigsCategory,
  extraSearchAttributes = [],
  toolBarContent,
  isSelectable,
  noDataHeader,
  noDataDescription
}: SmartAlertsTableViewProps<AlertConfig>) {
  const [{ orderBy, orderDirection, page, query }, setState] = useOptionalExternalState(
    externalState,
    setExternalState
  );

  const listItems = useRef<AlertConfigType[]>([]);
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

  const offset = (page - 1) * pageSize;
  const until = offset + pageSize;

  useEffect(() => {
    if (!loading) {
      listItems.current = [...searchResultsSelected].sort(sortBy(orderBy, orderDirection)).slice(offset, until);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResultsSelected, loading, orderBy, orderDirection, page]);

  if (loading) {
    return <LoadingList numSkeletonRows={3} />;
  }
  const defaultSelectedIndex = isCategoryGlobal(configsCategory) ? 0 : 1;

  const serverTableList = (
    <SmartAlertTablePresenter
      cardTitle={hasSingleCategory ? getLocalAlertConfigTitle(localSearchResults.length || 0) : undefined}
      columnDefinitions={columnDefinitions}
      result={getListItems(searchResultsSelected.length, listItems.current, pageSize)}
      orderBy={orderBy}
      orderDirection={orderDirection}
      page={page}
      query={query}
      pageSize={pageSize}
      pageSizes={[pageSize]}
      onChange={(data: Partial<TableState>) => {
        setState({
          page: data.page ?? page,
          orderBy: !isEmpty(data.orderBy) ? data.orderBy : orderBy,
          orderDirection: data.orderDirection,
          query: data.query ?? query
        });
      }}
      toolBarContent={toolBarContent}
      allRowSelected={selectedData.length > 0 && selectedData.length === listItems.current.length}
      rowSelected={selectedData}
      handleSelectAll={() => handleSelectAll(selectedData, setSelectedRows, listItems.current)}
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
