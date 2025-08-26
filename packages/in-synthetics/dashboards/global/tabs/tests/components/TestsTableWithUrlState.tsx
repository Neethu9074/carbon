/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useMemo, useState } from 'react';

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
import { getTestSummaryListData } from 'in-synthetics/dashboards/global/TestSummaryList';
import { urlParameters as timeConfigUrlParameters } from 'in-stores/time/config';
import CreateSyntheticTest from 'in-synthetics/createTests/CreateSyntheticTest';
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
  syntheticTests,
  timeConfig,
  isAssociationsContext,
  setFilter
}: TestsTableWithUrlStateProps) => {
  const [role] = useCurrentUserRole();
  const columnDefinitions = getColumnDefinitions(role);
  const [filtersTemp, setFiltersTemp] = useState<FilterState>({
    syntheticTypes,
    locationIds
  });

  const getRowDetails = (row: TestResultListItem) => {
    return <ExpandableResultList timeConfig={timeConfig} runType={runType} test={row} />;
  };

  const onFilterApply = () => {
    setFilter(filtersTemp);
  };

  const onFilterCancel = () => {
    setFiltersTemp({
      syntheticTypes,
      locationIds
    });
  };

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
      {...(isAssociationsContext ? {} : syntheticRbacLimitedEnabled ? { entityIds, associations } : { applicationIds })}
      {...(runType ? { runType } : {})}
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
        syntheticRunNowEnabled && !isAssociationsContext ? (
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
    />
  );
};
