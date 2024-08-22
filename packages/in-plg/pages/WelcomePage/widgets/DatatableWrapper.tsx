/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';
import { debounce } from 'lodash';

import { DashboardTable, DashboardTile } from '@instana/components';
import { DashboardTableRow as Row } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

// import RegularItemList from 'in-plg/pages/WelcomePage/widgets/table/RegularItemList';
import PinnedItemList, { Item } from 'in-plg/pages/WelcomePage/widgets/table/PinnedItemList';
import {
  DatatableWidgetProps,
  StarredItemWithIdsType,
  StarredItemType
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
import { getNoDataDescription, getNoDataHeader } from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
//@ts-expect-error no declaration file found
import { starredItems$ } from 'in-cockpit/starredItems';
//@ts-expect-error no declaration file found
import connectTo from 'in-hoc/connectTo';
import getResultsToDisplay from 'in-alerting/smart-alerts/components/list/ListHelper';
import ViewAllButton from 'in-plg/pages/WelcomePage/widgets/table/ViewAllButton';
import { playwithEnabled } from 'in-services/featureFlags';
import RegularItemList from './table/RegularItemList';
import { timeConfig$ } from 'in-stores/time/config';
import { t } from 'in-i18n';

interface AggregatedItems {
  [key: string]: string[];
}
export function getFlattenedIds(
  idsByType: StarredItemWithIdsType | undefined,
  types: (keyof StarredItemWithIdsType)[] | undefined
) {
  if (!types) return;
  if (!idsByType) return;
  let allIds: string[] = [];

  types.forEach(type => {
    const ids: string[] | undefined = idsByType[type];
    if (ids) {
      allIds = allIds.concat(ids);
    }
  });

  return allIds;
}

export default connectTo(({ pinnedItemTypes }: { pinnedItemTypes: (keyof StarredItemWithIdsType)[] }) => ({
  timeConfig: timeConfig$,
  pinnedItemIdsByType: starredItems$.map((starredItems: StarredItemType[]) =>
    starredItems.reduce((agg: AggregatedItems, starredItem: StarredItemType) => {
      const itemType = starredItem.type as keyof StarredItemWithIdsType;
      if (pinnedItemTypes?.indexOf(itemType) !== -1) {
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
    getItem,
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
    viewAll = true,
    pinnedItemIdsByType,
    pinnedItemTypes,
    searchPlaceholderLabel,
    addButtonLabel,
    viewAllLabel,
    maxItems = 5
  } = props;

  const [query, setQuery] = useState<string>('');
  const header = dashboardTileProps?.header ?? '';
  let hits = 0;
  let hasContent = false;
  let result = useObservable(getItems({ timeConfig, query, infraType, syntheticType, pageSize: 5 }), [
    timeConfig,
    query,
    infraType,
    syntheticType
  ]);

  const favIds = getFlattenedIds(pinnedItemIdsByType, pinnedItemTypes) ?? [];
  let numberOfRegularItemsToShow: number;

  if (result && result.data) {
    const resultDataItems = result.data.items ?? result.data;
    const hasQuery = query !== '';
    const isSmartAlerts = syntheticType === 'smartalerts';
    const searchData = hasQuery
      ? getSearchData({
          isDashboardWidget,
          isSmartAlerts,
          items: result.data,
          query
        })
      : null;

    const items = searchData ?? resultDataItems;
    numberOfRegularItemsToShow = Math.max(0, maxItems ? maxItems - favIds.length : items.length);
    hasContent = items.length > 0 ? true : false;
    hits = searchData?.length ?? result?.data?.totalHits ?? result.data.length;
    //For custom dashboard searching
    result = {
      ...result,
      data: {
        items: items
      }
    };
  }

  dashboardTileProps = {
    ...dashboardTileProps,
    header: dashboardTileProps ? `${dashboardTileProps.header} ${hits > 0 ? `(${hits})` : ''}` : ''
  };

  function pinnedItems() {
    const results = (
      <PinnedItemList
        getItem={getItem}
        key="pinned"
        timeConfig={timeConfig}
        pinnedItemIdsByType={pinnedItemIdsByType}
        processResults={(items: any) => {
          return items && items.length > 0
            ? items.sort(sort).map((item: any, index: number) => (
                <Row id={`${index}`} key={index}>
                  <Item
                    key={item.id}
                    type={item.type}
                    pendingItem={item}
                    timeConfig={timeConfig}
                    columnDefinitions={columnDefinitions}
                  />
                </Row>
              ))
            : null;
        }}
      />
    );
    return results;
  }

  function regularItems() {
    const results = (
      <RegularItemList
        key="regular"
        result={result}
        timeConfig={timeConfig}
        favIds={favIds}
        widgetName={tableType}
        numSkeletonRows={numberOfRegularItemsToShow}
        columnDefinitions={columnDefinitions}
      />
    );
    return results;
  }

  function viewAllButton(key: string) {
    if (viewAll) {
      if (hasContent || favIds.length) {
        return <ViewAllButton key={key} href={href} viewLabel={`${t('in-plg:welcomepage.viewAll')} ${viewAllLabel}`} />;
      } else {
        return (
          <ViewAllButton key={key} viewLabel={`${t('in-plg:welcomepage.viewAll')} ${viewAllLabel}`} isTableEmpty />
        );
      }
    }
    return;
  }

  const generateRows = () => {
    let rows = [];
    let rowId = 0;
    const regularItemsList = regularItems();
    const numberOfRegularItemsError = regularItemsList?.props?.result?.errors?.length;
    const numberOfRegularItemsLoading = regularItemsList?.props?.result?.progress?.loading;
    const numberOfregularItems = regularItemsList?.props?.result?.data?.items.length;

    if (favIds.length > 0) rows.push({ id: `${rowId++}`, ...pinnedItems() });
    if (numberOfRegularItemsError || numberOfRegularItemsLoading || numberOfregularItems) {
      rows.push({ id: `${rowId++}`, ...regularItemsList });
    }
    if (viewAll) rows.push({ id: `${rowId++}`, ...viewAllButton('viewAllButton') });
    return rows;
  };

  const dataArray = generateRows();
  const filteredArrayExcludingViewAllButton = dataArray.filter(item => item.key !== 'viewAllButton');

  return (
    <section aria-label={`${header}`} role="region">
      <DashboardTile {...dashboardTileProps} handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')} size="xs">
        <DashboardTable
          header={`${header}`}
          headers={headers}
          rows={generateRows()}
          searchPlaceHolder={`${t('in-plg:welcomepage.ariaLabel.search')} ${searchPlaceholderLabel}`}
          viewLabel={`${t('in-plg:welcomepage.viewAll')} ${viewAllLabel}`}
          iconColor={themes.default.ids.color.option.white}
          hasAddPermission={hasAddPermission}
          hasAddMore={hasAddMore && !playwithEnabled ? true : false}
          viewAll={viewAll ?? hasContent ? true : false}
          hasNoDataTile={!filteredArrayExcludingViewAllButton.length}
          addMore={addMore}
          addData={addData}
          href={href}
          noDataHeader={getNoDataHeader(label)}
          noDataDescription={getNoDataDescription(label)}
          onSearch={debounce((searchQuery: string) => {
            setQuery(searchQuery);
          }, 500)}
          buttonName={`${t('in-plg:welcomepage.addMore')} ${addButtonLabel ?? ''}`.trim()}
          toggles={dashboardTileProps.toggles}
          toggleCallback={dashboardTileProps.toggleCallback}
        />
      </DashboardTile>
    </section>
  );
});

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

function sort(i1: any, i2: any) {
  const mainKpiValue1 = i1?.result?.mainKpiValue || 0;
  const mainKpiValue2 = i2?.result?.mainKpiValue || 0;

  return mainKpiValue2 - mainKpiValue1;
}
