/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useLocation } from 'react-router';
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import { ColumnizedContent, Li, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
import { create } from '@instana/observables';
import { Stack } from '@instana/components';

import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/applications/components/SmartAlertsNoDataAvailable';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/applications/inventory/constants';
import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/inventory/EvaluationTypeColumn';
import ListEntityNameColumn from 'in-alerting/smart-alerts/applications/inventory/ListEntityNameColumn';
import ListActionsColumn from 'in-alerting/smart-alerts/applications/inventory/ListActionsColumn';
import ListFilterColumn from 'in-alerting/smart-alerts/applications/inventory/ListFiltersColumn';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { ListNameColumn } from 'in-alerting/smart-alerts/applications/inventory/ListNameColumn';
import SortingConfigurator from 'in-components/SortingConfigurator/SortingConfigurator';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { alertsCategory } from 'in-applications/navigation/matrix';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { hasError, isLoading } from 'in-services/util/result';
import { alertsTab } from 'in-applications/navigation/paths';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-components/ButtonGroup';
import SearchInput from 'in-components/SearchInput';
import Pagination from 'in-components/Pagination';
import useUrlState from 'in-hooks/useUrlState';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './SmartAlertsBaseList.mless';

const columnDefinitions = [
  {
    id: 'name',
    width: '35%',
    sortable: false,
    getContent({ config, configsCategory, additionalMatrixKeys, location }) {
      return (
        <ListNameColumn
          config={config}
          configsCategory={configsCategory}
          additionalMatrixKeys={additionalMatrixKeys}
          goToGlobalAlertDetails={location?.pathname === '/alerts'}
        />
      );
    }
  },
  {
    id: 'evaluationInfo',
    sortable: false,
    width: '20%',
    getContent({ config }) {
      return <EvaluationTypeColumn {...config} />;
    }
  },
  {
    id: 'entityName',
    width: '25%',
    sortable: false,
    getContent({ config, isGlobalSmartAlertConfig }) {
      return <ListEntityNameColumn {...config} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />;
    }
  },
  {
    id: 'filters',
    sortable: false,
    getContent({ config }) {
      return <ListFilterColumn {...config} />;
    }
  },
  {
    id: 'actions',
    sortable: false,
    getContent({ config, loading, isGlobalSmartAlertConfig }) {
      return (
        role.canConfigureCustomAlerts && (
          <ListActionsColumn config={config} isLoading={loading} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />
        )
      );
    }
  }
];

const sortOptions = [
  { label: t('in-alerting:smartAlerts.sortOptions.name'), value: 'name' },
  { label: t('in-alerting:smartAlerts.sortOptions.blueprint'), value: 'blueprint' },
  { label: t('in-alerting:smartAlerts.sortOptions.enabled'), value: 'enabled' },
  { label: t('in-alerting:smartAlerts.sortOptions.disabled'), value: 'disabled' },
  { label: t('in-alerting:smartAlerts.sortOptions.severity'), value: 'severity' },
  { label: t('in-alerting:smartAlerts.sortOptions.created'), value: 'created' }
];

const pageSize = 15;

const urlStateDefinition = {
  bind: [
    {
      path: alertsTab,
      name: 'orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: alertsTab,
      name: 'orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    },
    {
      path: alertsTab,
      name: alertsCategory,
      as: 'configsCategory',
      initialState: 'local' // "local" or "global"
    },
    {
      path: alertsTab,
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: intParser
    },
    {
      path: alertsTab,
      name: 'query',
      as: 'query',
      initialState: ''
    }
  ],
  resets: [
    {
      bind: [
        {
          path: alertsTab,
          name: 'configsCategory'
        },
        {
          path: alertsTab,
          name: 'orderBy'
        },
        {
          path: alertsTab,
          name: 'orderDirection'
        }
      ],
      reset: { page: 1 }
    }
  ]
};

const refreshSignal = create().emit({ emitLatestOnSubscribe: false });

export function refreshSmartAlertConfigsList() {
  refreshSignal.emit(true);
}

export default function SmartAlertsBaseList({
  onNoData,
  getGlobalAlertConfigFetchFunction,
  getLocalAlertConfigsFetchFunction,
  additionalMatrixKeys
}) {
  const [{ orderBy, orderDirection, configsCategory, page, query }, setUrlState] = useUrlState(urlStateDefinition);

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

  const location = useLocation();
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
                setUrlState({ configsCategory: categoryGlobal });
              }
            },
            {
              text: t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsList', {
                numberOfAlerts: localSearchResults.length || 0
              }),
              key: categoryLocal,
              onClick() {
                setUrlState({ configsCategory: categoryLocal });
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
                setUrlState({
                  orderBy: by,
                  orderDirection: direction
                })
              }
            />
          </div>
          <SearchInput query={query} onChange={updatedQuery => setUrlState({ query: updatedQuery, page: 1 })} />
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
                additionalMatrixKeys={additionalMatrixKeys}
                columnDefinitions={columnDefinitions}
                config={config}
                configsCategory={configsCategory}
                loading={loading}
                isGlobalSmartAlertConfig={isCategoryGlobal(configsCategory)}
                location={location}
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
        onChange={newPage => setUrlState({ page: newPage })}
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
  /**
   * Array containing additional keys/values which should be added as additional matrix parameters.
   * The function has the alertConfig as function parameter
   */
  additionalMatrixKeys: PropTypes.func
};
