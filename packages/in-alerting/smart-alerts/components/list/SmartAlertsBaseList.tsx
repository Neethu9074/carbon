/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import {
  ColumnizedDefinition,
  Pagination as CarbonPagination,
  ColumnizedContent,
  Li,
  Ul,
  Stack,
  ButtonGroup,
  SearchInput
} from '@instana/components';
import { Observable } from '@instana/observables';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import {
  categoryGlobal,
  categoryLocal,
  isCategoryGlobal,
  isCategoryLocal
} from 'in-alerting/smart-alerts/components/list/constants';
import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/components/SmartAlertsNoDataAvailable';
import { ServerTableUrlState } from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import { AlertConfigType } from 'in-alerting/smart-alerts/components/list/AlertsBaseList';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';
import getResultsToDisplay from 'in-alerting/smart-alerts/components/list/ListHelper';
import { SortOption } from 'in-components/SortingConfigurator/SortingConfigurator';
import { hasError, isLoading, successObservable } from 'in-services/util/result';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import ViewTrackingMeta from 'in-components/ViewTrackingMeta';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import { Error, OrderDirection, Result } from 'in-types';
import { Location } from 'in-stores/navigation/types';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/list/SmartAlertsBaseList.mless';

const defaultPageSize = 15;

export type TableState = Omit<ServerTableUrlState, 'disabledColumns' | 'enabledColumns' | 'pageSize'>;
const defaultState: TableState = {
  orderBy: 'name',
  orderDirection: 'ASC',
  page: 1,
  query: ''
};

const refreshSignal = create().emit({ emitLatestOnSubscribe: false });

export function refreshSmartAlertConfigsList() {
  refreshSignal.emit(true);
}

export type AlertFetchFunction<AlertConfig extends AlertConfigType> = () => Observable<Result<AlertConfig[]>>;

type ExtraSearchAttributes<AlertConfig extends AlertConfigType> = ((entity: AlertConfig) => string)[];

export interface SmartAlertsBaseListProps<AlertConfig extends AlertConfigType> {
  getLocalAlertConfigsFetchFunction: AlertFetchFunction<AlertConfig>;
  getGlobalAlertConfigFetchFunction?: AlertFetchFunction<AlertConfig>;
  getLocalAlertConfigTitle: (numberOfAlerts: number) => string;
  getGlobalAlertConfigTitle?: (numberOfAlerts: number) => string;
  columnDefinitions: ColumnizedDefinition[];
  pageSize?: number;
  createRowLinkLocation?: (config: AlertConfig, location: Location) => Location;
  configsCategory?: typeof categoryLocal | typeof categoryGlobal;
  setConfigsCategory?: (a: string) => void;
  sortOptions: SortOption[];
  extraSearchAttributes?: ExtraSearchAttributes<AlertConfig>;
  onNoData?: () => void;
  externalState: TableState;
  setExternalState: (state: Partial<TableState>) => void;
}

export default function SmartAlertsBaseList<AlertConfig extends AlertConfigType>({
  onNoData,
  getGlobalAlertConfigFetchFunction,
  getLocalAlertConfigsFetchFunction,
  getGlobalAlertConfigTitle,
  getLocalAlertConfigTitle,
  columnDefinitions,
  externalState,
  setExternalState,
  pageSize = defaultPageSize,
  createRowLinkLocation,
  configsCategory = categoryLocal,
  setConfigsCategory,
  sortOptions,
  extraSearchAttributes = [],
  ...remainingProps
}: SmartAlertsBaseListProps<AlertConfig>) {
  const [{ orderBy, orderDirection, page, query }, setState] = useOptionalExternalState(
    externalState,
    setExternalState
  );

  const fetchedGlobalAlerts = useSmartAlertConfigs(getGlobalAlertConfigFetchFunction);
  const fetchedLocalAlerts = useSmartAlertConfigs(getLocalAlertConfigsFetchFunction);

  const { configs, loading, errors } = getConfigByCategory({
    fetchedGlobalAlerts,
    fetchedLocalAlerts,
    configsCategory
  });

  useOnNoData({
    fetchedGlobalAlerts,
    fetchedLocalAlerts,
    onNoData
  });

  const { globalSearchResults, localSearchResults } = getSearchResults({
    query,
    fetchedGlobalAlerts,
    fetchedLocalAlerts,
    extraSearchAttributes
  });
  let searchResultsSelected = configs;
  if (isCategoryGlobal(configsCategory)) {
    searchResultsSelected = globalSearchResults;
  }
  if (isCategoryLocal(configsCategory)) {
    searchResultsSelected = localSearchResults;
  }

  // set the page parameter in Url to 1 once the loading is complete.
  useEffect(() => {
    if (!loading) {
      setState({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const offset = (page - 1) * pageSize;
  const until = offset + pageSize;

  const { location, createHref } = useNavigation();
  const hasSingleCategory = !getGlobalAlertConfigFetchFunction || !setConfigsCategory || !getGlobalAlertConfigTitle;
  return (
    <>
      <ViewTrackingMeta
        data={{
          pagePath: location?.pathname
        }}
      />
      <Stack>
        <HorizontalFlexWrapper className={locals.listHeader}>
          {hasSingleCategory && <ListTitle>{getLocalAlertConfigTitle(localSearchResults.length || 0)}</ListTitle>}

          {!hasSingleCategory && (
            <ButtonGroup
              segmented
              buttonPropsList={[
                {
                  text: getGlobalAlertConfigTitle(globalSearchResults.length || 0),
                  key: categoryGlobal,
                  onClick() {
                    setState({ page: 1 });
                    setConfigsCategory(categoryGlobal);
                  }
                },
                {
                  text: getLocalAlertConfigTitle(localSearchResults.length || 0),
                  key: categoryLocal,
                  onClick() {
                    setState({ page: 1 });
                    setConfigsCategory(categoryLocal);
                  }
                }
              ]}
              activeKey={configsCategory}
            />
          )}
          <HorizontalFlexWrapper>
            <div className={locals.sortingConfiguratorWrapper}>
              <SortingConfigurator
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
            </div>
            <SearchInput
              query={query}
              onChange={updatedQuery => setState({ query: updatedQuery, page: 1 })}
              placeholder={t('in-components:searchInput.placeholderSearch')}
            />
          </HorizontalFlexWrapper>
        </HorizontalFlexWrapper>
        <Ul framed>
          {/* copy this list because the result coming from createObservable() is strictly deep freezed */}
          {[...searchResultsSelected]
            .sort(sortBy(orderBy, orderDirection))
            .slice(offset, until)
            .map(config => {
              return (
                <Li key={config.id} href={createRowLinkLocation && createHref(createRowLinkLocation(config, location))}>
                  <ColumnizedContent
                    {...remainingProps}
                    columnDefinitions={columnDefinitions}
                    config={config}
                    loading={loading}
                  />
                </Li>
              );
            })}
          {searchResultsSelected.length === 0 ? (
            loading ? (
              <LoadingList numSkeletonRows={3} />
            ) : (
              <SmartAlertsNoDataAvailable text={getNoAlertConfiguredLabel(query)} />
            )
          ) : null}
          {hasError({ errors } as Result<AlertConfig>) && <ErrorList className={locals.list} errors={errors} />}
        </Ul>
        {searchResultsSelected.length > 0 && (
          <CarbonPagination
            currentPage={page}
            totalItems={searchResultsSelected.length}
            pageSize={pageSize}
            pageSizes={[pageSize]}
            onChange={(data: { page: number; pageSize: number }) => {
              const { page } = data;
              setState({ page });
            }}
          />
        )}
      </Stack>
    </>
  );
}

export function getSearchResults<AlertConfig extends AlertConfigType>({
  query,
  fetchedGlobalAlerts,
  fetchedLocalAlerts,
  extraSearchAttributes
}: {
  query: string;
  fetchedGlobalAlerts: FetchedConfigs<AlertConfig>;
  fetchedLocalAlerts: FetchedConfigs<AlertConfig>;
  extraSearchAttributes: ExtraSearchAttributes<AlertConfig>;
}) {
  const globalConfigs = fetchedGlobalAlerts.configs;
  const localConfigs = fetchedLocalAlerts.configs;
  const globalSearchResults = getResultsToDisplay(globalConfigs, query, extraSearchAttributes);
  const localSearchResults = getResultsToDisplay(localConfigs, query, extraSearchAttributes);

  return { globalSearchResults, localSearchResults };
}

export function getConfigByCategory<AlertConfig extends AlertConfigType>({
  configsCategory,
  fetchedGlobalAlerts,
  fetchedLocalAlerts
}: {
  configsCategory: typeof categoryLocal | typeof categoryGlobal;
  fetchedGlobalAlerts: FetchedConfigs<AlertConfig>;
  fetchedLocalAlerts: FetchedConfigs<AlertConfig>;
}): { configs: AlertConfig[]; loading: boolean; errors: Error[] } {
  if (isCategoryGlobal(configsCategory)) {
    return {
      configs: fetchedGlobalAlerts.configs,
      errors: fetchedGlobalAlerts.errors,
      loading: fetchedGlobalAlerts.isLoading
    };
  }

  if (isCategoryLocal(configsCategory)) {
    return {
      configs: fetchedLocalAlerts.configs,
      errors: fetchedLocalAlerts.errors,
      loading: fetchedLocalAlerts.isLoading
    };
  }

  return { configs: [], loading: true, errors: [] };
}

export type FetchedConfigs<AlertConfig extends AlertConfigType> = {
  configs: AlertConfig[];
  isLoading: boolean;
  errors: Error[];
};

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

function useOnNoData<AlertConfig extends AlertConfigType>({
  fetchedGlobalAlerts,
  fetchedLocalAlerts,
  onNoData
}: {
  fetchedGlobalAlerts: FetchedConfigs<AlertConfig>;
  fetchedLocalAlerts: FetchedConfigs<AlertConfig>;
  onNoData?: () => void;
}) {
  const numberGlobalSmartAlertConfigs = fetchedGlobalAlerts.configs?.length ?? 0;
  const numberLocalSmartAlertConfigs = fetchedLocalAlerts.configs?.length ?? 0;
  const isLoadingGlobalConfigs = fetchedGlobalAlerts.isLoading;
  const isLoadingLocalConfig = fetchedLocalAlerts.isLoading;

  const loadingFinished = !isLoadingGlobalConfigs && !isLoadingLocalConfig;
  const hasNoConfigsForEveryCategory = numberGlobalSmartAlertConfigs === 0 && numberLocalSmartAlertConfigs === 0;

  useEffect(() => {
    if (loadingFinished && hasNoConfigsForEveryCategory) {
      onNoData?.();
    }
  }, [loadingFinished, hasNoConfigsForEveryCategory, onNoData]);
}

export function sortBy<AlertConfig extends AlertConfigType>(orderBy: string, orderDirection: OrderDirection) {
  return (a: AlertConfig, b: AlertConfig) => {
    if (orderBy === 'name') {
      return orderDirection === 'ASC' ? compareIgnoreCase(a.name, b.name) : compareIgnoreCase(b.name, a.name);
    }
    if (orderBy === 'blueprint') {
      return orderDirection === 'ASC'
        ? compareIgnoreCase(a.rule?.alertType ?? '', b.rule?.alertType ?? '')
        : compareIgnoreCase(b.rule?.alertType ?? '', a.rule?.alertType ?? '');
    }
    if (orderBy === 'severity') {
      return orderDirection === 'ASC' ? a.severity - b.severity : b.severity - a.severity;
    }
    if (orderBy === 'created') {
      return orderDirection === 'ASC' ? a.created - b.created : b.created - a.created;
    }
    if (orderBy === 'initialCreated') {
      return orderDirection === 'ASC' ? a.initialCreated - b.initialCreated : b.initialCreated - a.initialCreated;
    }
    if (orderBy === 'enabled') {
      return orderDirection === 'ASC' ? Number(b.enabled) - Number(a.enabled) : Number(a.enabled) - Number(b.enabled);
    }
    if (orderBy === 'disabled') {
      return orderDirection === 'ASC' ? Number(a.enabled) - Number(b.enabled) : Number(b.enabled) - Number(a.enabled);
    }
    return orderDirection === 'ASC'
      ? compareIgnoreCase(a.toString(), b.toString())
      : compareIgnoreCase(b.toString(), a.toString());
  };
}

function getNoAlertConfiguredLabel(query: string) {
  return query
    ? t('in-alerting:smartAlerts.titleNoSmartAlertsConfiguredForSearchQuery')
    : t('in-alerting:smartAlerts.titleNoSmartAlertsConfigured');
}

export function useOptionalExternalState(
  externalState: TableState,
  setExternalState: (state: Partial<TableState>) => void
) {
  const [state, defaultSetState] = useState(defaultState);
  const setState = (newState: Partial<TableState>) => defaultSetState({ ...state, ...newState });
  if (setExternalState) {
    return [externalState, setExternalState] as const;
  }
  return [state, setState] as const;
}

SmartAlertsBaseList.propTypes = {
  /**
   * An optional function which returns an observable resolving with the api call result for
   * global smart alert configs. Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from teh outside
   * aka. injecting params etc.
   */
  getGlobalAlertConfigFetchFunction: PropTypes.func,
  /**
   * A requited function which returns an observable resolving with the api call result for
   * local smart alert configs. Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from the outside
   * aka. injecting params etc.
   */
  getLocalAlertConfigsFetchFunction: PropTypes.func.isRequired,

  /**
   * If a global config fetcher function is defined, get the title for the global alert config category.
   */
  getGlobalAlertConfigTitle: PropTypes.func,

  /**
   * Get the title of the local/individual alert config category.
   */
  getLocalAlertConfigTitle: PropTypes.func.isRequired,

  /**
   * Optional callback executed when there is no data to display
   */
  onNoData: PropTypes.func,

  columnDefinitions: PropTypes.array.isRequired,

  /**
   * Externally defined state, to be used instead of internal state handling.
   * Only used if `setExternalState` is defined
   */
  externalState: PropTypes.shape({
    orderBy: PropTypes.string.isRequired,
    orderDirection: PropTypes.string.isRequired,
    page: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired
  }),

  /**
   * create or adapt a location based on a given location, to add a link on
   * a row-click selection
   */
  createRowLinkLocation: PropTypes.func,
  /**
   * selecting a category (currently local or global) will be
   * done separately from "the generic list state".
   */
  configsCategory: PropTypes.string,

  setConfigsCategory: PropTypes.func,

  /**
   * External state setter, argument has the same type as `externalState`.
   * Setting this will disable internal state handling, providing `externalState`
   * is then required.
   */
  setExternalState: PropTypes.func,

  /**
   * The amount of alerts per page, defaults to 15
   */
  pageSize: PropTypes.number,

  /**
   * sort options
   */
  sortOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string
    })
  ).isRequired,

  /**
   * extraSearchAttributes
   *
   * array of functions which retrieve searchable attributes from each
   * item
   */
  extraSearchAttributes: PropTypes.arrayOf(PropTypes.func)
};
