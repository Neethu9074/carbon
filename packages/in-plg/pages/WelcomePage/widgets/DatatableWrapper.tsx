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
  DatatableWidgetProps
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { getNoDataDescription, getNoDataHeader } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import getResultsToDisplay from 'in-alerting/smart-alerts/components/list/ListHelper';
import { playwithEnabled } from 'in-services/featureFlags';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface ProcessedItem {
  id: string;
  [key: string]: React.ReactNode;
}

export default function DatatableWrapper({
  headers,
  getItems,
  timeConfig,
  infraType,
  columnDefinitions,
  hasAddMore,
  hasAddPermission,
  viewAll,
  label,
  addMore,
  addData,
  href,
  isDashboardWidget,
  syntheticType,
  maxItems = 5,
  dashboardTileProps
}: DatatableWidgetProps) {
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([]);
  const [itemCount, setItemCount] = useState<number>(0);
  const [query, setQuery] = useState<string>('');
  const header = dashboardTileProps?.header ?? '';

  const result = useObservable(getItems({ timeConfig, query, infraType, syntheticType }), [
    timeConfig,
    query,
    infraType,
    syntheticType
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

    const items = searchData ?? resultDataItems;
    const resultItems = maxItems ? items.slice(0, maxItems) : items;
    const hits = searchData?.length ?? data?.totalHits ?? data.length;
    const processedItems = getProcessedItems({ resultItems, columnDefinitions, result, timeConfig });

    setItemCount(hits);
    setProcessedItems(processedItems);
  }, [result, columnDefinitions, timeConfig, isDashboardWidget, query, syntheticType, maxItems]);

  return (
    <section aria-label={`${header}`} role="region">
      <DashboardTile {...dashboardTileProps} handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')} size="xs">
        <DashboardTable
          headers={headers}
          rows={processedItems}
          searchPlaceHolder={`${t('in-plg:welcomepage.ariaLabel.search')} ${header}`}
          viewLabel={`${t('in-plg:welcomepage.viewAll')} ${header}`}
          iconColor={themes.default.ids.color.option.white}
          hasAddPermission={hasAddPermission}
          hasAddMore={hasAddMore && !playwithEnabled ? true : false}
          viewAll={viewAll ? true : false}
          addMore={addMore}
          addData={addData}
          href={href}
          noDataHeader={getNoDataHeader(label)}
          noDataDescription={getNoDataDescription(label)}
          onSearch={(searchQuery: string) => {
            setQuery(searchQuery);
          }}
          buttonName={`${t('in-plg:welcomepage.addMore')} ${header}`}
          toggles={dashboardTileProps.toggles}
          toggleCallback={dashboardTileProps.toggleCallback}
          dataTableToolbarAriaLabel={`${header} ${t('in-plg:welcomepage.dataTableToolbar')}`}
        />
      </DashboardTile>
    </section>
  );
}

interface GeProcessedItemsProps {
  resultItems: [];
  result: [];
  columnDefinitions: [];
  timeConfig: TimeConfig;
}

function getProcessedItems({ resultItems, columnDefinitions, result, timeConfig }: GeProcessedItemsProps) {
  const processedItems: ProcessedItem[] = resultItems?.map((item: {}, index: number) => {
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
