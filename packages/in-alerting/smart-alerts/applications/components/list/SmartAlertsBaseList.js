/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ColumnizedContent, Li, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';
import { Stack } from '@instana/components';

import {
  categoryGlobal,
  categoryLocal,
  sortOptions
} from 'in-alerting/smart-alerts/applications/components/list/constants';
import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/applications/components/SmartAlertsNoDataAvailable';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { hasError, isLoading } from 'in-services/util/result';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-components/ButtonGroup';
import SearchInput from 'in-components/SearchInput';
import Pagination from 'in-components/Pagination';
import { t } from 'in-i18n';

import locals from './SmartAlertsBaseList.mless';

const pageSize = 15;

const defaultState = {
  orderBy: 'name',
  orderDirection: 'ASC',
  configsCategory: categoryLocal,
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
  ...remainingProps
}) {
  const [{ orderBy, orderDirection, configsCategory, page, query }, setState] = useOptionalExternalState(
    externalState,
    setExternalState
  );

  const {
    configs: globalConfigs,
    isLoading: isLoadingGlobalConfigs,
    errors: errorsGlobalConfigs
  } = useSmartAlertConfigs(getGlobalAlertConfigFetchFunction);

  const { configs: localConfigs, isLoading: isLoadingLocalConfigs, errors: errorsLocalConfigs } = useSmartAlertConfigs(
    getLocalAlertConfigsFetchFunction
  );

  const { configsSelected, loading, errors } = getConfigByCategory({
    configsCategory,
    globalConfigs,
    isLoadingGlobalConfigs,
    errorsGlobalConfigs,
    localConfigs,
    isLoadingLocalConfigs,
    errorsLocalConfigs
  });

  useOnNoData({
    numberGlobalSmartAlertConfigs: globalConfigs.length,
    numberLocalSmartAlertConfigs: localConfigs.length,
    isLoadingGlobalConfigs,
    isLoadingLocalConfigs,
    onNoData
  });

  const { globalSearchResults, localSearchResults, searchResultsSelected } = getSearchResults({
    query,
    globalConfigs,
    localConfigs,
    configsSelected,
    configsCategory
  });

  const offset = (page - 1) * pageSize;
  const until = offset + pageSize;

  return (
    <Stack>
      <HorizontalFlexWrapper className={locals.listHeader}>
        <ButtonGroup
          segmented
          buttonPropsList={[
            {
              text: t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsList', {
                numberOfAlerts: globalSearchResults.length || 0
              }),
              key: categoryGlobal,
              onClick() {
                setState({ configsCategory: categoryGlobal });
              }
            },
            {
              text: t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsList', {
                numberOfAlerts: localSearchResults.length || 0
              }),
              key: categoryLocal,
              onClick() {
                setState({ configsCategory: categoryLocal });
              }
            }
          ]}
          activeKey={configsCategory}
        />
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
          .map(config => (
            <Li key={config.id}>
              <ColumnizedContent
                {...remainingProps}
                columnDefinitions={columnDefinitions}
                config={config}
                configsCategory={configsCategory}
                loading={loading}
                isGlobalSmartAlertConfig={isCategoryGlobal(configsCategory)}
              />
            </Li>
          ))}
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

function getSearchResults({ globalConfigs, query, localConfigs, configsSelected, configsCategory }) {
  const globalSearchResults = getResultsToDisplay(globalConfigs, query);
  const localSearchResults = getResultsToDisplay(localConfigs, query);

  let searchResultsSelected = configsSelected;
  if (isCategoryGlobal(configsCategory)) {
    searchResultsSelected = globalSearchResults;
  }

  if (isCategoryLocal(configsCategory)) {
    searchResultsSelected = localSearchResults;
  }

  return { globalSearchResults, localSearchResults, searchResultsSelected };
}

function getConfigByCategory({
  configsCategory,
  globalConfigs,
  isLoadingGlobalConfigs,
  errorsGlobalConfigs,
  localConfigs,
  isLoadingLocalConfigs,
  errorsLocalConfigs
}) {
  let configsSelected = [];
  let errors = [];
  let loading = true;

  if (isCategoryGlobal(configsCategory)) {
    configsSelected = globalConfigs;
    loading = isLoadingGlobalConfigs;
    errors = errorsGlobalConfigs;
  }

  if (isCategoryLocal(configsCategory)) {
    configsSelected = localConfigs;
    loading = isLoadingLocalConfigs;
    errors = errorsLocalConfigs;
  }

  return { configsSelected, loading, errors };
}

function isCategoryGlobal(categorySelected) {
  return categorySelected === categoryGlobal;
}
function isCategoryLocal(categorySelected) {
  return categorySelected === categoryLocal;
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

function useOnNoData({
  numberGlobalSmartAlertConfigs,
  numberLocalSmartAlertConfigs,
  isLoadingGlobalConfigs,
  isLoadingLocalConfigs,
  onNoData
}) {
  const loadingFinished = !isLoadingGlobalConfigs && !isLoadingLocalConfigs;
  const hasConfigsForEveryCategory = numberGlobalSmartAlertConfigs === 0 && numberLocalSmartAlertConfigs === 0;

  useEffect(() => {
    if (loadingFinished && hasConfigsForEveryCategory) {
      onNoData?.();
    }
  }, [loadingFinished, hasConfigsForEveryCategory, onNoData]);
}

function sortBy(orderBy, orderDirection) {
  return (a, b) => {
    if (orderBy === 'name') {
      return orderDirection === 'ASC' ? compareIgnoreCase(a.name, b.name) : compareIgnoreCase(b.name, a.name);
    }
    if (orderBy === 'blueprint') {
      return orderDirection === 'ASC'
        ? compareIgnoreCase(a.rule.alertType, b.rule.alertType)
        : compareIgnoreCase(b.rule.alertType, a.rule.alertType);
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

function getResultsToDisplay(configsSelected, query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return configsSelected;
  }

  const lowerCaseQuery = trimmedQuery.toLowerCase();

  return configsSelected.filter(({ name, description, rule }) => {
    const configName = name.trim().toLowerCase();
    if (configName.includes(lowerCaseQuery)) {
      return true;
    }

    const configDescription = description.trim().toLowerCase();
    if (configDescription.includes(lowerCaseQuery)) {
      return true;
    }

    // Allows us to search text in configured language in client because this is the value from the language file
    const metricLabel = getBlueprintConfig(rule.alertType)
      .getMetricLabel(rule.metricName)
      .toLowerCase();

    if (metricLabel.includes(lowerCaseQuery)) {
      return true;
    }

    return false;
  });
}

function getNoAlertConfiguredLabel(query) {
  return query
    ? t('in-alerting:smartAlerts.titleNoSmartAlertsConfiguredForSearchQuery')
    : t('in-alerting:smartAlerts.titleNoSmartAlertsConfigured');
}

function useOptionalExternalState(externalState, setExternalState) {
  const defaultStateHandling = useState(defaultState);
  if (setExternalState) {
    return [externalState, setExternalState];
  }
  return defaultStateHandling;
}

SmartAlertsBaseList.propTypes = {
  /**
   * A function which returns an observable resolving with the api call result for
   * global smart alert configsSelected. Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from teh outside
   * aka. injecting params etc.
   */
  getGlobalAlertConfigFetchFunction: PropTypes.func,
  /**
   * A function which returns an observable resolving with the api call result for
   * local smart alert configsSelected. Please wrap http() calls in createObservable()
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
    configsCategory: PropTypes.oneOf([categoryLocal, categoryGlobal]).isRequired,
    page: PropTypes.number.isRequired,
    query: PropTypes.string.isRequired
  }),

  /**
   * External state setter, argument has the same type as `externalState`.
   * Setting this will disable internal state handling, providing `externalState`
   * is then required.
   */
  setExternalState: PropTypes.func
};
