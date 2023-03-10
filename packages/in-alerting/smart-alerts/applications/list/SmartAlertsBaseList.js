/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ColumnizedContent, Li, Ul, Stack } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';

import {
  categoryGlobal,
  categoryLocal,
  isCategoryGlobal,
  isCategoryLocal
} from 'in-alerting/smart-alerts/applications/list/constants';
import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/components/SmartAlertsNoDataAvailable';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';
import getResultsToDisplay from 'in-alerting/smart-alerts/components/list/ListHelper';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { hasError, isLoading } from 'in-services/util/result';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-components/ButtonGroup';
import SearchInput from 'in-components/SearchInput';
import Pagination from 'in-components/Pagination';
import ListTitle from 'in-components/lists/Title';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/list/SmartAlertsBaseList.mless';

const defaultPageSize = 15;

const defaultState = {
  orderBy: 'name',
  orderDirection: 'ASC',
  page: 1,
  query: ''
};

const refreshSignal = create().emit({ emitLatestOnSubscribe: false });

export function refreshSmartAlertConfigsList() {
  refreshSignal.emit(true);
}

export default function SmartAlertsBaseList({
  onNoData,
  getGlobalAlertConfigFetchFunction,
  getLocalAlertConfigsFetchFunction,
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
}) {
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

  const offset = (page - 1) * pageSize;
  const until = offset + pageSize;

  const { location, createHref } = useNavigation();

  const hasSingleCategory = !getGlobalAlertConfigFetchFunction;
  return (
    <Stack>
      <HorizontalFlexWrapper className={locals.listHeader}>
        {hasSingleCategory && (
          <ListTitle>
            {t('in-alerting:smartAlerts.list.header.configuredAlerts', {
              numberOfAlerts: localSearchResults.length || 0
            })}
          </ListTitle>
        )}

        {!hasSingleCategory && (
          <ButtonGroup
            segmented
            buttonPropsList={[
              {
                text: t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsList', {
                  numberOfAlerts: globalSearchResults.length || 0
                }),
                key: categoryGlobal,
                onClick() {
                  setConfigsCategory(categoryGlobal);
                }
              },
              {
                text: t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsList', {
                  numberOfAlerts: localSearchResults.length || 0
                }),
                key: categoryLocal,
                onClick() {
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
          <SearchInput query={query} onChange={updatedQuery => setState({ query: updatedQuery, page: 1 })} />
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
            <LoadingList numSkeletonRows="3" />
          ) : (
            <SmartAlertsNoDataAvailable text={getNoAlertConfiguredLabel(query)} />
          )
        ) : null}
        {hasError({ errors }) && <ErrorList className={locals.list} errors={errors} />}
      </Ul>
      <Pagination
        currentPage={page}
        numPages={Math.ceil(searchResultsSelected.length / pageSize)}
        onChange={newPage => setState({ page: newPage })}
      />
    </Stack>
  );
}

function getSearchResults({ query, fetchedGlobalAlerts, fetchedLocalAlerts, extraSearchAttributes }) {
  const globalConfigs = fetchedGlobalAlerts.configs;
  const localConfigs = fetchedLocalAlerts.configs;
  const globalSearchResults = getResultsToDisplay(globalConfigs, query, extraSearchAttributes);
  const localSearchResults = getResultsToDisplay(localConfigs, query, extraSearchAttributes);

  return { globalSearchResults, localSearchResults };
}

function getConfigByCategory({ configsCategory, fetchedGlobalAlerts, fetchedLocalAlerts }) {
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

function useSmartAlertConfigs(getAlertConfigFetchFunction) {
  const result =
    useObservable(() => {
      return refreshSignal.flatMap(getAlertConfigFetchFunction);
    }, []) ?? pendingResult;

  return {
    configs: result?.data ?? [],
    isLoading: isLoading(result),
    errors: result?.errors
  };
}

function useOnNoData({ fetchedGlobalAlerts, fetchedLocalAlerts, onNoData }) {
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

function sortBy(orderBy, orderDirection) {
  return (a, b) => {
    if (orderBy === 'name') {
      return orderDirection === 'ASC' ? compareIgnoreCase(a.name, b.name) : compareIgnoreCase(b.name, a.name);
    }
    if (orderBy === 'blueprint') {
      return orderDirection === 'ASC'
        ? compareIgnoreCase(a.rule?.alertType, b.rule?.alertType)
        : compareIgnoreCase(b.rule?.alertType, a.rule?.alertType);
    }
    if (orderBy === 'severity') {
      return orderDirection === 'ASC' ? a.severity - b.severity : b.severity - a.severity;
    }
    if (orderBy === 'created') {
      return orderDirection === 'ASC' ? a.created - b.created : b.created - a.created;
    }
    if (orderBy === 'enabled') {
      return orderDirection === 'ASC' ? b.enabled - a.enabled : a.enabled - b.enabled;
    }
    if (orderBy === 'disabled') {
      return orderDirection === 'ASC' ? a.enabled - b.enabled : b.enabled - a.enabled;
    }
  };
}

function getNoAlertConfiguredLabel(query) {
  return query
    ? t('in-alerting:smartAlerts.titleNoSmartAlertsConfiguredForSearchQuery')
    : t('in-alerting:smartAlerts.titleNoSmartAlertsConfigured');
}

function useOptionalExternalState(externalState, setExternalState) {
  const [state, defaultSetState] = useState(defaultState);
  const setState = newState => defaultSetState({ ...state, ...newState });
  if (setExternalState) {
    return [externalState, setExternalState];
  }
  return [state, setState];
}

SmartAlertsBaseList.propTypes = {
  /**
   * A function which returns an observable resolving with the api call result for
   * global smart alert configs. Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from teh outside
   * aka. injecting params etc.
   */
  getGlobalAlertConfigFetchFunction: PropTypes.func,
  /**
   * A function which returns an observable resolving with the api call result for
   * local smart alert configs. Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from the outside
   * aka. injecting params etc.
   */
  getLocalAlertConfigsFetchFunction: PropTypes.func,
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
