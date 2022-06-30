/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';
import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import getTestResultList from 'in-synthetics/subscriptions/getTestResultList';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { dummyTests } from 'in-synthetics/utils/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';

import locals from './FailedRun.mless';

interface FailedRunProps {
  testId: string;
  resultId: string;
}

export default function FailedRun({ testId, resultId }: FailedRunProps) {
  const timeConfig = useTimeConfig();
  let page = 1;
  let pageSize = 1;
  let content;
  const height = 160;

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

  if (resultList.progress.loading || resultList.progress.loading) {
    content = <LoadingIndicator text={t('in-components:topListCard.loadingData')} height={height} size="xxxl" />;
  }
  {
    if (Array.isArray(resultList.data) && !resultList.data.length) {
      return (
        <Card className={locals.failedTitle} title={t('in-synthetics:dashboard.detailsPage.failedRun')}>
          <h3 className={locals.errorMessageHeader}>{t('in-synthetics:dashboard.detailsPage.failedRunErrorTitle')}</h3>
          <span className={locals.errorMessage}>{t('in-synthetics:dashboard.detailsPage.noFailedErrorMessage')}</span>
        </Card>
      );
    }
    if (getStatus(resultList) === 1 && getErrors(resultList)?.length === 0) {
      // hide widget
      return <></>;
    } else if (getStatus(resultList) === 0 && getErrors(resultList)?.length === 0) {
      // if test failed with no error message, show "No error message"
      content = t('in-synthetics:dashboard.detailsPage.noFailedErrorMessage');
    } else {
      content = resultList?.data?.items[0].testResultCommonProperties.errors;
    }
  }

  return (
    <Card className={locals.failedTitle} title={t('in-synthetics:dashboard.detailsPage.failedRun')}>
      <h3 className={locals.errorMessageHeader}>{t('in-synthetics:dashboard.detailsPage.failedRunErrorTitle')}</h3>
      <span className={locals.errorMessage}>{content}</span>
    </Card>
  );
}

function getStatus(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return get(resultList?.data?.items, ['metrics', 'status', 0, 1]);
}

function getErrors(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return resultList?.data?.items[0].testResultCommonProperties.errors;
}
