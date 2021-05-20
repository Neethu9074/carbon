/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import PropTypes from 'prop-types';

import { ColumnizedContent, Li, Ul } from '@instana/components';
import { create, just } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import SmartAlertsNoDataAvailable from 'in-alerting/smart-alerts/applications/components/SmartAlertsNoDataAvailable';
import { categoryGlobal, categoryLocal } from 'in-alerting/smart-alerts/applications/inventory/constants';
import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/inventory/EvaluationTypeColumn';
import ListEntityNameColumn from 'in-alerting/smart-alerts/applications/inventory/ListEntityNameColumn';
import ListActionsColumn from 'in-alerting/smart-alerts/applications/inventory/ListActionsColumn';
import ListFilterColumn from 'in-alerting/smart-alerts/applications/inventory/ListFiltersColumn';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { ListNameColumn } from 'in-alerting/smart-alerts/applications/inventory/ListNameColumn';
import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import { alertsCategory } from 'in-applications/navigation/matrix';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { hasError, isLoading } from 'in-services/util/result';
import { alertsTab } from 'in-applications/navigation/paths';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-new-components/ButtonGroup';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import Stack from 'in-new-components/layout/Stack';
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
      initialState: 'local' // "local" or "global"""
    },
    {
      path: alertsTab,
      name: 'page',
      as: 'page',
      initialState: 1,
      parser: intParser
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
  const [{ orderBy, orderDirection, configsCategory, page }, setUrlState] = useUrlState(urlStateDefinition);
  const [query, setQuery] = useState('');

  const {
    configs,
    globalConfigsSelected: isGlobalSmartAlertConfig,
    loading,
    errors,
    numberGlobalSmartAlertConfigs,
    numberLocalSmartAlertConfigs
  } = useConfigsByCategory(getGlobalAlertConfigFetchFunction, getLocalAlertConfigsFetchFunction, configsCategory);

  useOnNoData(numberGlobalSmartAlertConfigs, numberLocalSmartAlertConfigs, onNoData);

  const location = useLocation();

  const offset = (page - 1) * pageSize;
  const until = offset + pageSize;
  const resultsToDisplay = getResultsToDisplay(configs, query);

  return (
    <Stack>
      <HorizontalFlexWrapper className={locals.listHeader}>
        <ButtonGroup
          segmented
          buttonPropsList={[
            {
              text: t('in-alerting:smartAlerts.applications.inventory.labelGlobalSmartAlertsList', {
                numberOfAlerts: numberGlobalSmartAlertConfigs || 0
              }),
              key: categoryGlobal,
              onClick() {
                setUrlState({ configsCategory: categoryGlobal });
              }
            },
            {
              text: t('in-alerting:smartAlerts.applications.inventory.labelSmartAlertsList', {
                numberOfAlerts: numberLocalSmartAlertConfigs || 0
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
          <SearchInput query={query} onChange={setQuery} />
        </HorizontalFlexWrapper>
      </HorizontalFlexWrapper>
      <Ul framed>
        {resultsToDisplay
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
                isGlobalSmartAlertConfig={isGlobalSmartAlertConfig}
                location={location}
              />
            </Li>
          ))}
        {loading && configs.length === 0 && <LoadingList numSkeletonRows="3" />}
        {!loading && !configs?.length && (
          <SmartAlertsNoDataAvailable text={t('in-alerting:smartAlerts.titleNoSmartAlertsConfigured')} />
        )}
        {hasError({ errors }) && <ErrorList className={locals.list} errors={errors} />}
      </Ul>
      <Pagination
        currentPage={page}
        numPages={Math.ceil(resultsToDisplay.length / pageSize)}
        onChange={newPage => setUrlState({ page: newPage })}
      />
    </Stack>
  );
}

function useConfigsByCategory(getGlobalAlertConfigFetchFunction, getLocalAlertConfigsFetchFunction, configsCategory) {
  const globalSmartAlertsConfigsResult = useObservable(() => {
    return refreshSignal.flatMap(getGlobalAlertConfigFetchFunction);
  }, []);

  const localSmartAlertsConfigsResult = useObservable(() => {
    return refreshSignal
      .flatMap(getLocalAlertConfigsFetchFunction)
      .startWith(localSmartAlertsConfigsResult ?? pendingResult);
  }, []);

  const globalConfigsSelected = configsCategory === categoryGlobal;

  let smartAlertConfigsResult = just({ data: [] });
  if (globalConfigsSelected) {
    smartAlertConfigsResult = globalSmartAlertsConfigsResult;
  } else if (configsCategory === categoryLocal) {
    smartAlertConfigsResult = localSmartAlertsConfigsResult;
  }

  // Only render the List when smartAlertConfigsResult?.data changes
  const [configs, setConfigs] = useState([]);
  useEffect(() => {
    const resultData = smartAlertConfigsResult?.data;
    if (resultData) {
      setConfigs([...resultData]);
    }
  }, [smartAlertConfigsResult?.data]);

  return {
    configs,
    globalConfigsSelected,
    loading: isLoading(smartAlertConfigsResult),
    errors: smartAlertConfigsResult?.errors,
    numberGlobalSmartAlertConfigs: globalSmartAlertsConfigsResult?.data?.length ?? null,
    numberLocalSmartAlertConfigs: localSmartAlertsConfigsResult?.data?.length ?? null
  };
}

function useOnNoData(numberGlobalSmartAlertConfigs, numberLocalSmartAlertConfigs, onNoData) {
  useEffect(() => {
    if (numberGlobalSmartAlertConfigs === 0 && numberLocalSmartAlertConfigs === 0) {
      onNoData?.();
    }
  }, [numberGlobalSmartAlertConfigs, numberLocalSmartAlertConfigs, onNoData]);
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

function getResultsToDisplay(configs, query) {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    return configs;
  }

  const lowerCaseQuery = trimmedQuery.toLowerCase();

  return configs.filter(({ name, description, rule }) => {
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

SmartAlertsBaseList.propTypes = {
  /**
   * A function which returns the function which return an observable subscription! which does the api call for
   * local smart alert configs.Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from teh outside
   * aka.injecting params etc.
   */
  getGlobalAlertConfigFetchFunction: PropTypes.func,
  /**
   * A function which returns the function which return an observable subscription! which does the api call for
   * local smart alert configs.Please wrap http() calls in createObservable()
   * This is done so that it is possible to configure the respective fetcher function from the outside
   * aka.injecting params etc.
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
