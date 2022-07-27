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

import getTestResultListStatus from 'in-synthetics/utils/getTestResultListStatus';

import locals from 'in-synthetics/dashboards/details/components/FailedRun.mless';

interface FailedRunProps {
  resultList: Result<PaginatedResult<TestResultListItem>>;
}

export default function FailedRun({ resultList }: FailedRunProps) {
  let content;

  if (Array.isArray(resultList.data) && !resultList.data.length) {
    return (
      <Card className={locals.failedTitle} title={t('in-synthetics:dashboard.detailsPage.failedRun')}>
        <h3 className={locals.errorMessageHeader}>{t('in-synthetics:dashboard.detailsPage.failedRunErrorTitle')}</h3>
        <span className={locals.errorMessage}>{t('in-synthetics:dashboard.detailsPage.noFailedErrorMessage')}</span>
      </Card>
    );
  } else if (getTestResultListStatus(resultList) === 0 && getErrors(resultList)?.length === 0) {
    // if test failed with no error message, show "No error message"
    content = t('in-synthetics:dashboard.detailsPage.noFailedErrorMessage');
  } else {
    content = resultList?.data?.items[0].testResultCommonProperties.errors;
  }

  return (
    <Card className={locals.failedTitle} title={t('in-synthetics:dashboard.detailsPage.failedRun')}>
      <h3 className={locals.errorMessageHeader}>{t('in-synthetics:dashboard.detailsPage.failedRunErrorTitle')}</h3>
      <span className={locals.errorMessage}>{content}</span>
    </Card>
  );
}

function getErrors(resultList: Result<PaginatedResult<TestResultListItem>>) {
  return get(resultList.data?.items[0], ['testResultCommonProperties', 'errors', 0], '');
}
