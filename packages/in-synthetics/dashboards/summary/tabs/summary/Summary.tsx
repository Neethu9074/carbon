/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React, { Fragment } from 'react';

import { PaginatedResult, Result, TagFilter, TestResultListItem } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';
import { Message } from '@instana/components';

import SummaryCharts from 'in-synthetics/dashboards/summary/tabs/summary/SummaryCharts';
import SummaryKPIs from 'in-synthetics/dashboards/summary/tabs/summary/SummaryKPIs';
import { TestResponse, dummyTestResultList } from 'in-synthetics/utils/constants';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { useLocation } from 'in-stores/navigation/LocationStateProvider';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { syntheticsDashboard } from 'in-synthetics/navigation/paths';
import { getMatrixParameter } from 'in-stores/navigation/matrix';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { TimeShift } from 'in-components/Chart/types';
import { Location } from 'in-stores/navigation/types';
import { testIdTagName } from 'in-synthetics/tags';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

interface SummaryProps {
  test: TestResponse;
}

export default function Summary({ test }: SummaryProps) {
  const page = 1;
  const pageSize = 1;
  const timeConfig = useTimeConfig();
  const timeShiftConfig: TimeShift = useTimeShiftConfig();
  const location: Location = useLocation();
  const testId: string = getMatrixParameter(location, syntheticsDashboard, 'testId') ?? '';
  const testType = getMatrixParameter(location, syntheticsDashboard, 'type');
  const isSSLCertificate = testType === 'SSLCertificate';
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

  const resultList: Result<PaginatedResult<TestResultListItem>> =
    useObservable<any, [number]>(
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
      [0]
    ) || dummyTestResultList;

  const totalHits = resultList.data?.totalHits ?? 0;
  if (!resultList.progress.loading && totalHits === 0 && isSSLCertificate) {
    return (
      <Message
        withIcon
        title={t('in-synthetics:dashboard.summary.smallerTimeFrameTitle')}
        description={t('in-synthetics:dashboard.summary.smallerTimeFrameDescription')}
        bold
      />
    );
  }
  return (
    <Fragment>
      {!resultList.progress.loading && (
        <SummaryKPIs
          tagFilters={tagFilters}
          isSSLCertificate={isSSLCertificate}
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
        />
      )}
    </Fragment>
  );
}
