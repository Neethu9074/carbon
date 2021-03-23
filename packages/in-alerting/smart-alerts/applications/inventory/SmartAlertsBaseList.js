/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { create, just } from '@instana/observables';
import React, { useEffect, useState } from 'react';
import { useObservable } from '@instana/hooks';
import PropTypes from 'prop-types';

import EvaluationTypeColumn from 'in-alerting/smart-alerts/applications/inventory/EvaluationTypeColumn';
import ListActionsColumn from 'in-alerting/smart-alerts/applications/inventory/ListActionsColumn';
import ListFiltersColumn from 'in-alerting/smart-alerts/applications/inventory/ListFiltersColumn';
import { ListNameColumn } from 'in-alerting/smart-alerts/applications/inventory/ListNameColumn';
import SortingConfigurator from 'in-new-components/SortingConfigurator/SortingConfigurator';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import { ColumnizedContent, Li, Ul } from 'in-new-components/lists/List';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import { intParser } from 'in-stores/navigation/urlParameterUtils';
import { alertsTab } from 'in-applications/navigation/paths';
import { compareIgnoreCase } from 'in-services/util/string';
import { pendingResult } from 'in-services/fixedObjects';
import ButtonGroup from 'in-new-components/ButtonGroup';
import SearchInput from 'in-new-components/SearchInput';
import Pagination from 'in-new-components/Pagination';
import { isLoading } from 'in-services/util/result';
import Stack from 'in-new-components/layout/Stack';
import useUrlState from 'in-hooks/useUrlState';
import { t } from 'in-i18n';

import locals from './SmartAlertsBaseList.mless';

const columnDefinitions = [
  {
    id: 'name',
    label: t('in-alerting:smartAlerts.applications.inventory.labelName'),
    width: '35%',
    widthInAbsoluteUnit: true,
    sortable: false,
    getContent({ config, configsCategory, additionalMatrixKeys, isGlobalSmartAlertConfig }) {
      return (
        <ListNameColumn
          config={config}
          configsCategory={configsCategory}
          additionalMatrixKeys={additionalMatrixKeys}
          goToGlobalAlertDetails={isGlobalSmartAlertConfig}
        />
      );
    }
  },
  {
    id: 'evaluationInfo',
    sortable: false,
    getContent({ config }) {
      return <EvaluationTypeColumn {...config} />;
    }
  },
  {
    id: 'filters',
    label: t('in-alerting:smartAlerts.applications.inventory.labelFilters'),
    sortable: false,
    getContent({ config, localSmartAlertsListProps }) {
      return <ListFiltersColumn {...config} applicationName={localSmartAlertsListProps?.applicationName} />;
    }
  },
  {
    id: 'actions',
    width: '15%',
    widthInAbsoluteUnit: true,
    sortable: false,
    getContent({ config, loading, isGlobalSmartAlertConfig }) {
      return (
        <ListActionsColumn config={config} isLoading={loading} isGlobalSmartAlertConfig={isGlobalSmartAlertConfig} />
      );
    }
  }
];

const sortOptions = [
  { label: 'Name', value: 'name' },
  { label: 'Blueprint', value: 'blueprint' },
  { label: 'Enabled', value: 'enabled' },
  { label: 'Disabled', value: 'disabled' },
  { label: 'Severity', value: 'severity' },
  { label: 'Date created', value: 'created' }
];

export const alertsCategoryMatrixParam = 'alerts.configsCategory';
export const categoryLocal = 'local';
export const categoryGlobal = 'global';
const pageSize = 15;

const urlStateDefinition = {
  bind: [
    {
      path: alertsTab,
      name: 'alerts.orderBy',
      as: 'orderBy',
      initialState: 'name'
    },
    {
      path: alertsTab,
      name: 'alerts.orderDirection',
      as: 'orderDirection',
      initialState: 'ASC'
    },
    {
      path: alertsTab,
      name: alertsCategoryMatrixParam,
      as: 'configsCategory',
      initialState: 'local' // "local" or "global"""
    },
    {
      path: alertsTab,
      name: 'alerts.page',
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
  localSmartAlertsListProps,
  additionalMatrixKeys
}) {
  const [{ orderBy, orderDirection, configsCategory, page }, setUrlState] = useUrlState(urlStateDefinition);
  const numberGlobalSmartAlertConfigs = useNumberOfGlobalAlertConfigs(getGlobalAlertConfigFetchFunction);
  const numberLocalSmartAlertConfigs = useNumberOfLocalAlertConfigs(getLocalAlertConfigsFetchFunction);

  useOnNoData(numberGlobalSmartAlertConfigs, numberLocalSmartAlertConfigs, onNoData);

  const { configs, loading, globalConfigsSelected: isGlobalSmartAlertConfig } = useConfigsByCategory(
    getGlobalAlertConfigFetchFunction,
    getLocalAlertConfigsFetchFunction,
    configsCategory
  );

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
          <SearchInput />
        </HorizontalFlexWrapper>
      </HorizontalFlexWrapper>
      <Ul framed>
        {configs
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
                localSmartAlertsListProps={localSmartAlertsListProps}
                isGlobalSmartAlertConfig={isGlobalSmartAlertConfig}
              />
            </Li>
          ))}
        {loading && configs.length === 0 && <LoadingList numSkeletonRows="3" />}
        {!loading && !configs?.length && <NoDataAvailable text={'NO DATA FOO'} height={86} />}
      </Ul>
      <Pagination
        currentPage={page}
        numPages={Math.trunc(
          (isGlobalSmartAlertConfig ? numberGlobalSmartAlertConfigs : numberLocalSmartAlertConfigs) / pageSize
        )}
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

  const loading = isLoading(smartAlertConfigsResult);

  const [configs, setConfigs] = useState([]);
  useEffect(() => {
    const resultData = smartAlertConfigsResult?.data;
    if (resultData) {
      setConfigs([...resultData]);
    }
  }, [smartAlertConfigsResult?.data]);

  return { configs, loading, globalConfigsSelected };
}

function useNumberOfGlobalAlertConfigs(getGlobalAlertConfigFetchFunction) {
  return useObservable(() => getGlobalAlertConfigFetchFunction().map(({ data }) => data?.length), []) ?? null;
}

function useNumberOfLocalAlertConfigs(getLocalAlertConfigsFetchFunction) {
  return useObservable(() => getLocalAlertConfigsFetchFunction().map(({ data }) => data?.length), []) ?? null;
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
   * Additional Proptypes only for local smart alerts list
   */
  localSmartAlertsListProps: PropTypes.shape({
    applicationName: PropTypes.string
  }),
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
