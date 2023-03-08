/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Message } from '@instana/components';

import { hasError } from 'in-services/util/result';
import { t, Trans } from 'in-i18n';
import theme from 'in-themes';

export default function HistoricBaselineErrorMessage({ thresholdResult }) {
  if (hasError(thresholdResult)) {
    return (
      <Message type="neutral" iconColor={theme.lib.colors.failure} withIcon>
        <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.baselineErrorMessageInsufficientDataToCompute" />
        <br />
        <b>{`${t('in-alerting:smartAlerts.components.smartAlertDialog.baselineErrorMessageReason')} `}</b>
        {getErrorReason(thresholdResult)}
      </Message>
    );
  }

  if (thresholdResult?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE') {
    return (
      <Message type="neutral" iconColor={theme.lib.colors.N800Dark} withIcon>
        {t('in-alerting:smartAlerts.components.smartAlertDialog.baselineErrorMessageComputedOnApproximateData')}
      </Message>
    );
  }

  return null;
}

function getErrorReason(thresholdResult) {
  return thresholdResult.errors[0].message;
}
