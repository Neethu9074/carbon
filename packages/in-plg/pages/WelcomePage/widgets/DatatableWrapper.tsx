/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useEffect } from 'react';

import { DashboardTable, DashboardTile } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  GetContentFunction,
  DatatableWidgetProps,
  StarredItemWithIdsType,
  StarredItemType,
  ColumnDefinitionItem
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import {
  getNoDataDescription,
  getNoDataHeader,
  processItemsBasedOnTable
} from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
//@ts-expect-error doesn't contain type file
import { starredItems$ } from 'in-cockpit/starredItems';
//@ts-expect-error doesn't contain type file
import connectTo from 'in-hoc/connectTo';
import getResultsToDisplay from 'in-alerting/smart-alerts/components/list/ListHelper';
import { playwithEnabled } from 'in-services/featureFlags';
import { timeConfig$ } from 'in-stores/time/config';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface ProcessedItem {
  id: string;
  [key: string]: React.ReactNode;
}
interface AggregatedItems {
  [key: string]: string[];
}
export function getFlattenedIds(idsByType: StarredItemWithIdsType | undefined) {
  if (!idsByType) return;
  let allIds: string[] = [];
  const keys = Object.keys(idsByType) as (keyof StarredItemWithIdsType)[];
  for (let i = 0; i < keys.length; i++) {
    const ids = idsByType[keys[i]];
    if (ids) {
      allIds = allIds.concat(ids);
    }
  }
  return allIds;
}

export default connectTo(({ pinnedItemTypes }: { pinnedItemTypes: string[] }) => ({
  timeConfig: timeConfig$,
  pinnedItemIdsByType: starredItems$.map((starredItems: StarredItemType[]) =>
    starredItems.reduce((agg: AggregatedItems, starredItem: StarredItemType) => {
      if (pinnedItemTypes?.indexOf(starredItem.type) !== -1) {
        agg[starredItem.type] = agg[starredItem.type] || [];
        agg[starredItem.type].push(starredItem.id || '');
      }
      return agg;
    }, {})
  )
}))(function DatatableWrapper(props: DatatableWidgetProps) {
  let {
    tableType,
    headers,
    getItems,
    timeConfig,
    infraType,
    columnDefinitions,
    hasAddMore,
    hasAddPermission,
    label,
    addMore,
    addData,
    href,
    isDashboardWidget,
    syntheticType,
    dashboardTileProps,
    viewAll,
    pinnedItemIdsByType
  } = props;

  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const [hasContent, setHasContent] = useState<boolean>(false);
  const header = dashboardTileProps?.header ?? '';
  const addLabel = dashboardTileProps?.addLabel;
  const searchAndViewAllLabel = dashboardTileProps?.searchAndViewAllLabel;

  const result = useObservable(getItems({ timeConfig, query, infraType, syntheticType }), [
    timeConfig,
    query,
    infraType,
    syntheticType
  ]);

  let resultForEmptyStateCheck = useObservable(getItems({ timeConfig, pinnedItemIdsByType }), [
    timeConfig,
    pinnedItemIdsByType
  ]);
  dashboardTileProps = {
    ...dashboardTileProps,
    header: dashboardTileProps ? `${dashboardTileProps.header} ${itemCount > 0 ? `(${itemCount})` : ''}` : ''
  };

  useEffect(() => {
    const data = result?.data;

    if (!data) {
      return;
    }

    const resultDataItems = data.items ?? data;
    const hasQuery = query !== '';
    const isSmartAlerts = syntheticType === 'smartalerts';
    const searchData = hasQuery
      ? getSearchData({
          isDashboardWidget,
          isSmartAlerts,
          items: data,
          query
        })
      : null;

    const pinnedIds = getFlattenedIds(pinnedItemIdsByType) ?? [];
    const items = searchData ?? resultDataItems;
    setHasContent(items.length > 0 ? true : false);
    const hits = searchData?.length ?? data?.totalHits ?? data.length;
    const processedItems = getProcessedItems({
      tableType,
      items,
      pinnedIds,
      columnDefinitions,
      result,
      timeConfig
    });

    setItemCount(hits);
    setProcessedItems(processedItems);
  }, [result, tableType, columnDefinitions, timeConfig, isDashboardWidget, query, syntheticType, pinnedItemIdsByType, resultForEmptyStateCheck]);

  return (
    <section aria-label={`${header}`} role="region">
      <DashboardTile {...dashboardTileProps} handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')} size="xs">
        <DashboardTable
          header={`${header}`}
          headers={headers}
          rows={processedItems}
          searchPlaceHolder={`${t('in-plg:welcomepage.ariaLabel.search')} ${
            searchAndViewAllLabel ? searchAndViewAllLabel : header
          }`}
          viewLabel={`${t('in-plg:welcomepage.viewAll')} ${searchAndViewAllLabel ? searchAndViewAllLabel : header}`}
          iconColor={themes.default.ids.color.option.white}
          hasAddPermission={hasAddPermission}
          hasAddMore={hasAddMore && !playwithEnabled ? true : false}
          viewAll={viewAll ?? hasContent ? true : false}
          addMore={addMore}
          addData={addData}
          href={href}
          noDataHeader={getNoDataHeader(label)}
          noDataDescription={getNoDataDescription(label)}
          onSearch={(searchQuery: string) => {
            setQuery(searchQuery);
          }}
          buttonName={`${t('in-plg:welcomepage.addMore')} ${addLabel ? addLabel : header}`}
          toggles={dashboardTileProps.toggles}
          toggleCallback={dashboardTileProps.toggleCallback}
        />
      </DashboardTile>
    </section>
  );
});

interface GetProcessedItemsProps {
  tableType: string;
  pinnedIds: string[];
  result: [];
  columnDefinitions: ColumnDefinitionItem[];
  timeConfig: TimeConfig;
  items: any;
}

function getProcessedItems({
  tableType,
  items,
  pinnedIds,
  columnDefinitions,
  result,
  timeConfig
}: GetProcessedItemsProps) {
  const totalList = processItemsBasedOnTable(tableType, items, pinnedIds);
  const processedItems: ProcessedItem[] = totalList?.map((item: {}, index: number) => {
    const processedItem: ProcessedItem = { id: `${index}` };
    columnDefinitions?.forEach(({ key, getContent }: { key: string; getContent: GetContentFunction }) => {
      const value = getContent({ item, result, timeConfig });
      processedItem[key] = value;
    });
    return processedItem;
  });

  return processedItems;
}

interface SearchDataProps {
  isDashboardWidget?: boolean;
  isSmartAlerts: boolean;
  query: string;
  items: any;
}

function getSearchData({ isDashboardWidget, isSmartAlerts, items, query }: SearchDataProps) {
  if (isDashboardWidget) {
    return items.filter(({ title }: { title: string }) => title.toLowerCase().includes(query.trim().toLowerCase()));
  }

  if (isSmartAlerts) {
    return getResultsToDisplay(items, query, [() => '']);
  }

  return;
}
