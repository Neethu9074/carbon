/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState, useCallback, useEffect } from 'react';

import { TestResultListItem } from '@instana/types';
import { Dropdown } from '@instana/carbon';

import {
  TestsTableWithUrlStateProps,
  locationsUrlParameter,
  matrixPrefix,
  pathSegment,
  syntheticTypesUrlParameter,
  TestListProps,
  FilterState,
  datascopeRunTypes
} from 'in-synthetics/utils/constants';
import {
  syntheticRbacLimitedEnabled,
  syntheticRunNowEnabled,
  syntheticSslImprovementEnabled
} from 'in-services/featureFlags';
import { ExpandableResultList } from 'in-synthetics/dashboards/global/tabs/tests/components/ExpandableResultList';
import getColumnDefinitions from 'in-synthetics/dashboards/global/tabs/tests/components/columnDefinitions';
import TestListFilters from 'in-synthetics/dashboards/global/tabs/tests/components/TestListFilters';
import CarbonDataTableWithUrlState from 'in-synthetics/components/CarbonDataTableWithUrlState';
import TagFilters from 'in-synthetics/dashboards/global/tabs/tests/components/TagFilters';
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import CreateSyntheticTest from 'in-synthetics/createTests/CreateSyntheticTest';
import useTestListFilter from 'in-synthetics/hooks/useTestListFilter';
import useCurrentUserRole from 'in-stores/useCurrentUserRole';
import { close } from 'in-components/DialogPresenter/store';
import { t } from 'in-i18n';

import locals from 'in-synthetics/dashboards/global/TestSummaryList.mless';

export const TestsTableWithUrlState = ({
  context,
  appId,
  mobileAppId,
  websiteId,
  syntheticTypes,
  locationIds,
  applicationIds,
  entityIds,
  associations,
  runType,
  executionType,
  syntheticTests,
  timeConfig,
  isAssociationsContext,
  setFilter
}: TestsTableWithUrlStateProps) => {
  const [role] = useCurrentUserRole();
  const columnDefinitions = getColumnDefinitions(role);
  const [filtersTemp, setFiltersTemp] = useState<FilterState>({
    syntheticTypes,
    locationIds,
    ...(syntheticRbacLimitedEnabled ? { entityIds } : { applicationIds }),
    executionType
  });

  // Keep filtersTemp in sync with the global filter state
  useEffect(() => {
    setFiltersTemp({
      syntheticTypes,
      locationIds,
      ...(syntheticRbacLimitedEnabled ? { entityIds } : { applicationIds }),
      executionType
    });
  }, [syntheticTypes, locationIds, entityIds, applicationIds, executionType]);

  // Create a mapping of location IDs to their display labels
  const locationMap = useMemo(() => {
    // Create an object with locationId as key and locationDisplayLabel as value
    return (
      syntheticTests?.data?.reduce((map, test) => {
        if (test?.locationDisplayLabels && test?.locations) {
          test.locationDisplayLabels.forEach((label, i) => {
            const locationId = test.locations[i];
            if (locationId && label) {
              // Only add if not already in the map (first occurrence wins)
              if (!map[locationId]) {
                map[locationId] = label;
              }
            }
          });
        }
        return map;
      }, {} as Record<string, string>) || {}
    );
  }, [syntheticTests?.data]);

  const { getFilterLabel, tagFilters, setTagFilters, resetFilters } =
    useTestListFilter({
      filterUrlPathParams: {
        syntheticTypes,
        locationIds,
        ...(syntheticRbacLimitedEnabled ? { entityIds } : { applicationIds }),
        executionType
      },
      setFilter: setFilter,
      locationMap
    }) || {};

  const getRowDetails = (row: TestResultListItem) => {
    return <ExpandableResultList timeConfig={timeConfig} runType={runType} test={row} />;
  };

  const onFilterApply = useCallback(() => {
    setTagFilters([
      {
        id: 'executionType',
        value: filtersTemp.executionType
      },
      {
        id: 'type',
        value: filtersTemp.syntheticTypes
      },
      {
        id: 'location',
        value: filtersTemp.locationIds
      },
      syntheticRbacLimitedEnabled
        ? {
            id: 'association',
            value: filtersTemp.entityIds
          }
        : {
            id: 'application',
            value: filtersTemp.applicationIds
          }
    ]);
    setFilter(filtersTemp);
  }, [filtersTemp, setTagFilters, setFilter]);

  const onFilterCancel = useCallback(() => {
    setFiltersTemp({
      syntheticTypes,
      locationIds,
      ...(syntheticRbacLimitedEnabled ? { entityIds } : { applicationIds }),
      executionType
    });
  }, [syntheticTypes, locationIds, entityIds, applicationIds, executionType]);

  const filterComponent = useMemo(() => {
    if (syntheticTests?.progress.loading) return null;
    return (
      <TestListFilters
        isAssociationsContext={isAssociationsContext}
        result={syntheticTests}
        filters={filtersTemp}
        setFilters={setFiltersTemp}
      />
    );
  }, [syntheticTests, isAssociationsContext, filtersTemp]);

  const getContextSpecificProps = useCallback(() => {
    return syntheticRbacLimitedEnabled ? { entityIds, associations } : { applicationIds };
  }, [entityIds, associations, applicationIds]);

  const tagFilterContent = useMemo(
    () => (
      <TagFilters
        columnFilters={tagFilters}
        setColumnFilters={setTagFilters}
        getFilterLabel={getFilterLabel}
        resetFilters={resetFilters}
        setFilter={setFilter}
      />
    ),
    [tagFilters, setTagFilters, getFilterLabel, resetFilters, setFilter]
  );

  return (
    <CarbonDataTableWithUrlState<TestResultListItem, TestListProps>
      timeConfig={timeConfig}
      context={context}
      {...(appId ? { appId: appId } : {})}
      {...(mobileAppId ? { mobileAppId: mobileAppId } : {})}
      {...(websiteId ? { websiteId: websiteId } : {})}
      get={getTestSummaryListData}
      syntheticTypes={syntheticTypes}
      locationIds={locationIds}
      {...(isAssociationsContext ? {} : getContextSpecificProps())}
      {...(runType ? { runType } : {})}
      {...(executionType ? { executionType } : {})}
      loading={syntheticTests?.progress.loading}
      paginationResettingUrlParameters={[...timeConfigUrlParameters, syntheticTypesUrlParameter, locationsUrlParameter]}
      columnDefinitions={
        isAssociationsContext
          ? columnDefinitions.filter(column => !['applicationLabels', 'applicationLabel'].includes(column.id))
          : columnDefinitions
      }
      defaultOrderBy="successRate"
      defaultOrderDirection="ASC"
      pathSegment={pathSegment}
      matrixPrefix={matrixPrefix}
      searchText={t('in-synthetics:dashboard.testList.searchSyntheticTests')}
      noDataHeader={t('in-synthetics:dashboard.noDataAvailable.testSummaryTitle')}
      noDataDescription={t('in-synthetics:dashboard.noDataAvailable.testSummaryDescription')}
      errorHeader={t('in-synthetics:dashboard.testList.failedToLoadTestsTitle')}
      defaultDisabledColumns={[
        'avg_response_time',
        'location',
        syntheticRbacLimitedEnabled ? 'associationLabels' : 'applicationLabel',
        'health'
      ]}
      actionButtonContent={
        role?.canConfigureSyntheticTests && !isAssociationsContext && <CreateSyntheticTest onClose={close} />
      }
      toolBarContent={
        syntheticRunNowEnabled && !syntheticSslImprovementEnabled && !isAssociationsContext ? (
          <Dropdown
            className={locals.dropdownWidth}
            items={datascopeRunTypes}
            onChange={({ selectedItem }) => {
              setFilter({ runType: selectedItem?.value! });
            }}
            label=""
            id="runType"
            titleText=""
            selectedItem={datascopeRunTypes.find(item => item.value === runType)}
            initialSelectedItem={datascopeRunTypes[0]}
          />
        ) : undefined
      }
      isFilterable
      filters={filterComponent}
      onFilterApply={onFilterApply}
      onFilterCancel={onFilterCancel}
      {...(syntheticSslImprovementEnabled ? { isExpandable: true, getRowDetails: getRowDetails } : {})}
      tagFilterContent={tagFilterContent}
    />
  );
};
