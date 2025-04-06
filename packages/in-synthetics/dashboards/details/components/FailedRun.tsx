/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { PaginatedResult, Result, TestResultListItem } from '@instana/types/typeDefinitions';
import { Card } from '@instana/components';
import { t } from '@instana/i18n-react';

// @ts-expect-error
import ExpandableCard from 'in-components/AnalyzeView/FacetedFilters/ExpandableCardWithSubtitle';

import locals from 'in-synthetics/dashboards/details/components/FailedRun.mless';

interface FailedRunProps {
  resultList: Result<PaginatedResult<TestResultListItem>>;
  testType: string;
}

export default function FailedRun({ resultList, testType }: FailedRunProps) {
  let errMsg: string;
  let stacktraceMsg: string;
  let errorType: string;
  const isSSLCertificate: boolean = testType === 'SSLCertificate';
  const isDNS: boolean = testType === 'DNS';
  const isScriptTest = ['HTTPScript', 'BrowserScript', 'WebpageScript'].includes(testType);

  if (Array.isArray(resultList.data) && !resultList.data.length) {
    return (
      <Card className={locals.failedTitle} title={t('in-synthetics:dashboard.detailsPage.failedRun')}>
        <h3 className={locals.errorMessageHeader}>{t('in-synthetics:dashboard.detailsPage.failedRunErrorTitle')}</h3>
        <span className={locals.errorMessage}>{t('in-synthetics:dashboard.detailsPage.noFailedErrorMessage')}</span>
      </Card>
    );
  } else {
    const errorTypeStart = getErrors(resultList).search('errorType=');
    let start: number = getErrors(resultList).search('errorMessage=');
    let end: number = getErrors(resultList).search('stackTrace=');
    let len: number = getErrors(resultList)?.length;
    errorType = getErrors(resultList).slice(errorTypeStart + 'errorType='.length, start - '  '.length);
    errMsg =
      !isSSLCertificate && !isDNS
        ? getErrors(resultList).slice(start + 'errorMessage='.length, end - '  '.length)
        : getErrors(resultList).slice(start + 'errorMessage='.length, len - 1);
    stacktraceMsg = isScriptTest
      ? getErrors(resultList).slice(end + 'stacktrace='.length, len - '}'.length)
      : undefined;
  }

  return (
    <Card className={locals.failedTitle} title={t('in-synthetics:dashboard.detailsPage.failedRun')}>
      <h3 className={locals.errorMessageHeader}>{t('in-synthetics:dashboard.detailsPage.failedRunErrorTypeTitle')}</h3>
      {errorType && <span className={locals.errorMessage}>{errorType}</span>}
      <h3 className={locals.errorMessageHeader}>{t('in-synthetics:dashboard.detailsPage.failedRunErrorTitle')}</h3>
      {errMsg ? (
        <span className={locals.errorMessage}>{errMsg}</span>
      ) : (
        <span className={locals.errorMessage}>{t('in-synthetics:dashboard.detailsPage.noFailedErrorMessage')}</span>
      )}
      {isScriptTest && (
        <ExpandableCard
          headerClassName={locals.stacktraceHeader}
          title={t('in-synthetics:dashboard.detailsPage.stackTraceTitle')}
          framed={false}
          openByDefault
        >
          {stacktraceMsg ? (
            <span className={locals.stacktraceMessage}>
              {stacktraceMsg.split('\n').map(function (msg: any, i: any) {
                return <div key={i}>{msg}</div>;
              })}
            </span>
          ) : (
            <span className={locals.stacktraceMessage}>{t('in-synthetics:dashboard.detailsPage.noStacktrace')}</span>
          )}
        </ExpandableCard>
      )}
    </Card>
  );
}

function getErrors(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return get(resultList.data?.items[0], ['testResultCommonProperties', 'errors', 0], '');
}
