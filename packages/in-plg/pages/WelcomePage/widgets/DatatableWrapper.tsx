/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';

import { Pagination as CarbonPagination, CarbonTableRow as Row } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import {
  DEFAULT_NUMBER_ROWS,
  MAX_NUMBER_ROWS,
  getNoDataDescription,
  getNoDataHeader
} from 'in-plg/pages/WelcomePage/widgets/utils/WidgetUtil';
import {
  DatatableWidgetProps,
  StarredItemWithIdsType,
  StarredItemType
} from 'in-plg/pages/WelcomePage/widgets/types/DashboardTypeDefiniton';
//@ts-expect-error no declaration file found
import { starredItems$ } from 'in-plg/pages/WelcomePage/widgets/starredItems';
import PinnedItemList, { Item } from 'in-plg/pages/WelcomePage/widgets/table/PinnedItemList';
//@ts-expect-error no declaration file found
import connectTo from 'in-hoc/connectTo';
import getResultsToDisplay from 'in-alerting/smart-alerts/components/list/ListHelper';
import RegularItemList from 'in-plg/pages/WelcomePage/widgets/table/RegularItemList';
import { DashboardTable } from 'in-plg/components/DashboardTable/DashboardTable';
import ViewAllButton from 'in-plg/pages/WelcomePage/widgets/table/ViewAllButton';
import { DashboardTile } from 'in-plg/components/DashboardTile/DashboardTile';
import { CustomDashboardWithUserSpecificInformation } from 'in-types';
import { playwithEnabled } from 'in-services/featureFlags';
import { pendingResult } from 'in-services/fixedObjects';
import { timeConfig$ } from 'in-stores/time/config';
import { hasError } from 'in-services/util/result';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from 'in-plg/pages/WelcomePage/widgets/DatatableWrapper.mless';

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
    nonDeletedFavoriteCount,
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
    maxItems = DEFAULT_NUMBER_ROWS,
    mainPage
  } = props;

  const [{ query }, setQuery] = useUrlState({
    //useState<string>(urlQuery || '');
    bind: [
      {
        path: '/customDashboards',
        name: 'query',
        initialState: ''
      }
    ]
  });
  const [page, setPage] = useState(1);
  const pageSizes = [10, 20, 30];
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const header = dashboardTileProps?.header ?? '';
  let teamsSearch: string | RegExpMatchArray | null = query.match(/:teams:(.+)!/);
  if (teamsSearch) {
    teamsSearch = teamsSearch[1];
  }
  const maxQuery = isDashboardWidget && teamsSearch;
  let hits = 0;
  const hitsRef = useRef<number>(0);
  let hasContent = false;
  let result = useObservable(
    getItems({
      timeConfig,
      query: teamsSearch ? '' : query, //will use client-side search in teamsSearch mode
      infraType,
      syntheticType,
      page: mainPage && !maxQuery ? page : 1,
      pageSize: maxQuery ? MAX_NUMBER_ROWS : mainPage ? pageSize : DEFAULT_NUMBER_ROWS
    }).startWith(pendingResult),
    [timeConfig, query, infraType, syntheticType, page, pageSize]
  );
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
          allItems: result.data,
          teamsSearch,
          page: mainPage ? page : 1,
          pageSize: mainPage ? pageSize : DEFAULT_NUMBER_ROWS,
          query
        })
      : null;

    const items = searchData?.items ?? resultDataItems;
    numberOfRegularItemsToShow = Math.max(
      0,
      maxItems ? maxItems - (nonDeletedFavoriteCount ?? favIds.length) : items.length
    );
    hasContent = items.length > 0 ? true : false;
    hits = searchData?.hits ?? result?.data?.totalHits ?? result.data.length;
    hitsRef.current = hits ?? 0;
    //For custom dashboard searching
    result = {
      ...result,
      data: {
        items: items
      }
    };
  }

  const { header: updatedHeader = '' } = dashboardTileProps || {};
  const hitsCount = hitsRef.current > 0 ? `(${hitsRef.current})` : '';
  dashboardTileProps = {
    ...dashboardTileProps,
    header: header !== '' ? `${updatedHeader} ${hitsCount}` : ''
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
            ? removeDeletedFavoritedEntries(items, tableType)
                .sort(sort)
                .map((item: any, index: number) => (
                  <Row id={`${tableType}-pinned-${index}`} key={index}>
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

  function removeDeletedFavoritedEntries(items?: any, tableType?: string) {
    if (
      tableType === 'websitesWidget' ||
      tableType === 'mobileListWidget' ||
      tableType === 'dashboardWidget' ||
      tableType === 'platformsWidget'
    ) {
      return items.filter((item: any) => !hasError(item.result));
    } else return items;
  }

  function regularItems(mainPage?: boolean, pageSize?: number) {
    const results = (
      <RegularItemList
        key="regular"
        result={result}
        timeConfig={timeConfig}
        favIds={favIds}
        widgetName={tableType}
        numSkeletonRows={numberOfRegularItemsToShow}
        columnDefinitions={columnDefinitions}
        mainPage={mainPage}
        pageSize={pageSize}
      />
    );
    return results;
  }

  function viewAllButton(key: string) {
    if (hasContent || favIds.length) {
      return <ViewAllButton key={key} href={href} viewLabel={`${t('in-plg:welcomepage.viewAll')} ${viewAllLabel}`} />;
    } else {
      return <ViewAllButton key={key} viewLabel={`${t('in-plg:welcomepage.viewAll')} ${viewAllLabel}`} isTableEmpty />;
    }
  }

  const generateRows = () => {
    let rows = [];
    let rowId = 0;
    const regularItemsList = regularItems(mainPage, pageSize);
    const numberOfRegularItemsError = regularItemsList?.props?.result?.errors?.length;
    const numberOfRegularItemsLoading = regularItemsList?.props?.result?.progress?.loading;
    const numberOfregularItems = regularItemsList?.props?.result?.data?.items.length;

    if (favIds.length > 0 && !mainPage) rows.push({ id: `${rowId++}`, ...pinnedItems() });
    if (numberOfRegularItemsError || numberOfRegularItemsLoading || numberOfregularItems) {
      rows.push({ id: `${rowId++}`, ...regularItemsList });
    }
    return rows;
  };

  const dataArray = generateRows();
  const hasNoDataTile = !dataArray.length;
  const updatedHeaders = mainPage ? headers.filter(obj => obj.key !== 'favourite') : null;
  const dataLoading = result?.progress?.loading;
  const showPagination = mainPage && (dataLoading || hits > pageSizes[0]);
  const dashboardAddMoreLabel = t('in-plg:welcomepage.component.dashboardWidget.addButtonLabel');
  const addMorePrefix =
    addButtonLabel === dashboardAddMoreLabel ? t('in-plg:welcomepage.create') : t('in-plg:welcomepage.addMore');
  return (
    <section
      className={classNames({
        [locals.dataTableWrapper]: true,
        [locals.noData]: hasNoDataTile
      })}
      aria-label={`${header}`}
    >
      <DashboardTile {...dashboardTileProps} handleLabel={t('in-plg:welcomepage.ariaLabel.handleButton')} size="xs">
        <DashboardTable
          header={`${header}`}
          headers={updatedHeaders ?? headers}
          rows={generateRows()}
          searchPlaceHolder={`${t('in-plg:welcomepage.ariaLabel.search')} ${searchPlaceholderLabel}`}
          viewLabel={`${t('in-plg:welcomepage.viewAll')} ${viewAllLabel}`}
          iconColor={themes.default.ids.color.option.white}
          hasAddPermission={hasAddPermission}
          hasAddMore={hasAddMore && !playwithEnabled ? true : false}
          viewAll={viewAll ?? hasContent ? true : false}
          hasNoDataTile={hasNoDataTile}
          addMore={addMore}
          addData={addData}
          href={href}
          noDataHeader={getNoDataHeader(label)}
          noDataDescription={getNoDataDescription(label)}
          onSearch={debounce((searchQuery: string) => {
            setQuery({ query: searchQuery });
            setPage(1);
          }, 500)}
          buttonName={`${addMorePrefix} ${addButtonLabel ?? ''}`.trim()}
          toggles={dashboardTileProps.toggles}
          toggleCallback={dashboardTileProps.toggleCallback}
        />
        {viewAll && viewAllButton('viewAllButton')}
      </DashboardTile>
      {showPagination && (
        <CarbonPagination
          currentPage={page}
          totalItems={hitsRef.current}
          pageSize={pageSize}
          pageSizes={pageSizes}
          onChange={(data: { page: number; pageSize: number }) => {
            setPage(data?.page);
            setPageSize(data.pageSize);
          }}
        />
      )}
    </section>
  );
});

interface SearchDataProps {
  isDashboardWidget?: boolean;
  isSmartAlerts: boolean;
  teamsSearch: string | null;
  page: number;
  pageSize: number;
  query: string;
  allItems: any;
}
interface TeamTagEx {
  tag_id?: string;
  id?: string;
  entity_id: string;
  displayName: string;
}
interface customDashboardConfig extends CustomDashboardWithUserSpecificInformation {
  rbacTags: TeamTagEx[];
}

function getSearchData({
  isSmartAlerts,
  isDashboardWidget,
  teamsSearch,
  page,
  pageSize,
  allItems,
  query
}: SearchDataProps) {
  if (isSmartAlerts) {
    const items = getResultsToDisplay(allItems, query, [() => '']);
    return { hits: items.length, items: items };
  }
  if (isDashboardWidget && teamsSearch && allItems.totalHits) {
    const filteredRes = allItems?.items.filter((item: customDashboardConfig) => {
      return item.rbacTags?.some((tag: TeamTagEx) => {
        return tag.displayName == teamsSearch;
      });
    });
    let pageStart = (page - 1) * pageSize;
    if (pageStart >= filteredRes.length) {
      pageStart = 0;
    }
    return { hits: filteredRes.length, items: filteredRes.splice(pageStart, pageSize) };
  }

  return;
}

function sort(i1: any, i2: any) {
  const mainKpiValue1 = i1?.result?.mainKpiValue || 0;
  const mainKpiValue2 = i2?.result?.mainKpiValue || 0;

  return mainKpiValue2 - mainKpiValue1;
}
