/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState, useEffect } from 'react';

import { DashboardTable, DashboardTile } from '@instana/components';
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
    if (result?.data) {
      let resultItems;
      if (result?.data && result?.data?.items) {
        resultItems = result.data.items.slice(0, 5);
      } else {
        setItemCount(result.data.length);
        resultItems = result.data.slice(0, 5);
      }

      if (result?.data?.totalHits) {
        setItemCount(result.data.totalHits);
      }

      // For smart Alerts the search is being done in front-end
      if (query !== '' && syntheticType === 'smartalerts') {
        const extraSearchAttributes: [] = [];
        //@ts-expect-error
        const searchData = getResultsToDisplay(result.data, query, extraSearchAttributes);
        setItemCount(searchData.length);
        resultItems = searchData.slice(0, 5);
      }

      const processedItemsArray: ProcessedItem[] = resultItems.map((item: {}, index: number) => {
        const processedItem: ProcessedItem = { id: index };
        columnDefinitions?.forEach(({ key, getContent }: { key: string; getContent: GetContentFunction }) => {
          const value = getContent({ item, result, timeConfig });
          processedItem[key] = value;
        });
        return processedItem;
      });
      setProcessedItems(processedItemsArray);
    }
  }, [result, columnDefinitions, timeConfig, isDashboardWidget, query, syntheticType]);

  const exclusionArray = [
    'infrastructure',
    'platforms',
    'businessmonitoring',
    'incidents',
    'syntheticmonitoring.location'
  ];

  return (
    <DashboardTile {...dashboardTileProps} handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')}>
      <DashboardTable
        headers={headers}
        rows={processedItems}
        searchPlaceholder="Search"
        viewLabel={t('in-plg:welcomepage.viewAll')}
        iconColor="#ffffff"
        hasAddMore={hasAddMore ? true : false}
        viewAll={viewAll ? true : false}
        addMore={addMore}
        addData={addData}
        href={href}
        header={getNoDataHeader(label)}
        description={getNoDataDescription(label)}
        buttonName={!exclusionArray.includes(label) ? getNoDataButton(label) : undefined}
        searchLabel={t('in-plg:welcomepage.ariaLabel.searchButton')}
        addLabel={t('in-plg:welcomepage.ariaLabel.addButton')}
        onSearch={(searchQuery: string) => {
          setQuery(searchQuery);
        }}
        iconDescription={`${t('in-plg:welcomepage.addMore')} ${header}`}
      />
    </DashboardTile>
  );
}
