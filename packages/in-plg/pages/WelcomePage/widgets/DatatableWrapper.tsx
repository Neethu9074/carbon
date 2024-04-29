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
  getNoDataButton,
  getNoDataDescription,
  getNoDataHeader
} from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import {
  GetContentFunction,
  DatatableWidgetProps
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import getResultsToDisplay from 'in-alerting/smart-alerts/components/list/ListHelper';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

interface ProcessedItem {
  id: number;
  [key: string]: React.ReactNode;
}

export default function DatatableWrapper({
  headers,
  getItems,
  timeConfig,
  infraType,
  columnDefinitions,
  hasAddMore,
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

  const exclusionArray = [
    'infrastructure',
    'platforms',
    'businessmonitoring',
    'incidents',
    'syntheticmonitoring.location'
  ];

  return (
    <section aria-label={dashboardTileProps.sectionLabel} role="region">
      <DashboardTile {...dashboardTileProps} handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')} size="xs">
        <DashboardTable
          headers={headers}
          rows={processedItems}
          searchPlaceholder={t('in-plg:welcomepage.search')}
          viewLabel={t('in-plg:welcomepage.viewAll')}
          iconColor={themes.default.ids.color.option.white}
          hasAddMore={hasAddMore ? true : false}
          viewAll={viewAll ? true : false}
          addMore={addMore}
          addData={addData}
          href={href}
          header={getNoDataHeader(label)}
          description={getNoDataDescription(label)}
          buttonName={!exclusionArray.includes(label) ? getNoDataButton(label) : undefined}
          searchLabel={`${t('in-plg:welcomepage.ariaLabel.search')} ${header}`}
          addLabel={`${t('in-plg:welcomepage.ariaLabel.add')} ${header}`}
          onSearch={(searchQuery: string) => {
            setQuery(searchQuery);
          }}
          iconDescription={`${t('in-plg:welcomepage.addMore')} ${header}`}
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
    const processedItem: ProcessedItem = { id: index };
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
