/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import { dummyTests, ResultDetailsResponse } from 'in-synthetics/utils/constants';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './FailedRun.mless';

interface FailedRunProps {
  details: ResultDetailsResponse;
}

export default function FailedRun({ details }: FailedRunProps) {
  const timeConfig = useTimeConfig();
  let page = 1;
  let pageSize = 1;
  let content;
  const height = 160;
  const testId = details.data?.testId;
  const resultId = details.data?.testResultId;

  let tagFilters = [
    {
      stringValue: testId,
      name: 'testId',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    },
    {
      stringValue: resultId,
      name: 'id',
      operator: EQUALS,
      entity: NOT_APPLICABLE,
      type: 'TAG_FILTER'
    }
  ];

  let resultList: Result<PaginatedResult<TestResultListItem>> =
    useObservable<any, [number]>(
      () =>
        getTestResultList({
          pagination: {
            page,
            pageSize
          },
          order: { by: 'errors', direction: 'DESC' },
          syntheticMetrics: ['errors', 'status'],
          filter: {
            timeConfig,
            includeInternalCalls: false,
            includeSyntheticCalls: false,
            useLongTermDataOnly: false
          },
          // @ts-expect-error tagFilters do not fully match the TagFilter type
          tagFilters: tagFilters
        }),
      [0]
    ) || dummyTests;

  if (details.progress.loading || resultList.progress.loading) {
    content = <LoadingIndicator text={t('in-components:topListCard.loadingData')} height={height} size="xxxl" />;
  } else if (getStatus(resultList) === 1 && getErrors(resultList)?.length === 0) {
    // hide widget
    return <></>;
  } else if (getStatus(resultList) === 0 && getErrors(resultList)?.length === 0) {
    // if test failed with no error message, show "No error message"
    content = 'No error message';
  } else {
    content = resultList.data?.items[0]?.testResultCommonProperties.errors;
  }

  return (
    <Card className={locals.failedTitle} title={t('in-synthetics:dashboard.summary.failedRun')}>
      <h3 className={locals.errorMessageHeader}>Error Message</h3>
      <span className={locals.errorMessage}>{content}</span>
    </Card>
  );
}

function getStatus(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return resultList.data?.items[0]?.metrics.status[0][1];
}

function getErrors(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return resultList.data?.items[0]?.testResultCommonProperties.errors;
}
