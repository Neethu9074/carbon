/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';

import { PaginatedResult, Result, TagFilter, TestResultListItem } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import {
  DataScopeType,
  TestResponse,
  dummyTestResultList,
  runTypeCICD,
  runTypeScheduled
} from 'in-synthetics/utils/constants';
import SummaryCharts from 'in-synthetics/dashboards/summary/tabs/summary/SummaryCharts';
import SummaryKPIs from 'in-synthetics/dashboards/summary/tabs/summary/SummaryKPIs';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { testIdTagName, runTypeTagName } from 'in-synthetics/tags';
import { syntheticRunNowEnabled } from 'in-services/featureFlags';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { TimeShift } from 'in-components/Chart/types';
import { Location } from 'in-stores/navigation/types';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface SummaryProps {
  test: TestResponse;
  dataScope?: DataScopeType;
}

export default function Summary({ test, dataScope }: SummaryProps) {
  const page = 1;
  const pageSize = 1;
  const timeConfig = useTimeConfig();
  const timeShiftConfig: TimeShift = useTimeShiftConfig();
  const location: Location = useLocation();
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  const testType = getMatrixParameter(location, syntheticsDashboard, 'type');
  const isSSLCertificate = testType === 'SSLCertificate';
  const isDNS = testType === 'DNS';
  const locationDisplayLabels: string =
    getMatrixParameter(location, syntheticsDashboard, 'locationDisplayLabels') ?? '';
  const locationIds: string = getMatrixParameter(location, syntheticsDashboard, 'locationIds') ?? '';
  const tagFilters: TagFilter[] = [
    {
      stringValue: testId,
      name: testIdTagName,
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];
  if (syntheticRunNowEnabled) {
    tagFilters.push({
      stringValue: dataScope?.value === runTypeCICD ? runTypeScheduled : dataScope?.value,
      name: runTypeTagName,
      operator: dataScope?.value === runTypeCICD ? NOT_EQUAL : EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    });
  }
  const resultList: Result<PaginatedResult<TestResultListItem>> =
    useObservable<any, [DataScopeType]>(
      () =>
        getTestResultList({
          pagination: {
            page,
            pageSize
          },
          order: { by: 'start_time', direction: 'DESC' },
          syntheticMetrics: ['custom_metrics'],
          filter: {
            timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false
          },
          tagFilters: tagFilters //tagFilters only has test_id.
        }),
      [dataScope!]
    ) || dummyTestResultList;

  const totalHits = resultList.data?.totalHits ?? 0;
  if (!resultList.progress.loading && totalHits === 0 && isSSLCertificate) {
    return (
      <Message
        withIcon
        title={t('in-synthetics:dashboard.summary.smallerTimeFrameTitle')}
        description={t('in-synthetics:dashboard.summary.smallerTimeFrameDescription')}
        bold
        fullInlineWidth
      />
    );
  }
  return (
    <Fragment>
      {!resultList.progress.loading && (
        <SummaryKPIs
          tagFilters={tagFilters}
          isSSLCertificate={isSSLCertificate}
          isDNS={isDNS}
          resultList={resultList}
          timeShiftConfig={timeShiftConfig}
          timeConfig={timeConfig}
        />
      )}
      {!test.progress.loading && (
        <SummaryCharts
          testId={testId}
          testType={testType}
          test={test}
          locationIds={locationIds}
          locationDisplayLabels={locationDisplayLabels}
          timeShiftConfig={timeShiftConfig}
          runType={dataScope?.value}
        />
      )}
    </Fragment>
  );
}
