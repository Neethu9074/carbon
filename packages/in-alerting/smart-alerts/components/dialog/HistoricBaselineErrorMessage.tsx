/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { HistoricBaselineData, Result, ResultPrecisionDetails } from '@instana/types';
import { themes } from '@instana/design-tokens';
import { Message } from '@instana/components';

import { hasError } from 'in-services/util/result';
import { t, Trans } from 'in-i18n';

interface ResultPrecisionType {
  resultPrecisionDetails?: ResultPrecisionDetails;
}
type HistoricBaselineErrorMessageType = Result<HistoricBaselineData | ResultPrecisionType>;

interface HistoricBaselineErrorMessageProps {
  thresholdResult: HistoricBaselineErrorMessageType;
}
export default function HistoricBaselineErrorMessage({ thresholdResult }: HistoricBaselineErrorMessageProps) {
  if (hasError(thresholdResult)) {
    return (
      <Message type="warning" iconColor={themes.default.ids.color.option.red['500']} withIcon fullInlineWidth>
        <span>
          {getErrorCode(thresholdResult) === 'VALIDATION' ? (
            <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.baselineValidationMessageInsufficientDataToCompute" />
          ) : (
            <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.baselineGenericErrorMessage" />
          )}
          <br />
          <b>{`${t('in-alerting:smartAlerts.components.smartAlertDialog.baselineErrorMessageReason')} `}</b>
          {getErrorReason(thresholdResult)}
        </span>
      </Message>
    );
  }

  if (thresholdResult?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE') {
    return (
      <Message type="neutral" iconColor={themes.default.ids.color.option.neutral['800']} withIcon fullInlineWidth>
        {t('in-alerting:smartAlerts.components.smartAlertDialog.baselineErrorMessageComputedOnApproximateData')}
      </Message>
    );
  }

  return null;
}

function getErrorReason(thresholdResult: HistoricBaselineErrorMessageType) {
  return thresholdResult.errors[0].message;
}

function getErrorCode(thresholdResult: HistoricBaselineErrorMessageType) {
  return thresholdResult.errors[0].code;
}
