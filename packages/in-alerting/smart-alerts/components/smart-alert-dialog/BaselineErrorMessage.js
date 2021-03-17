/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import Message from 'in-new-components/Message';
import Trans from 'in-i18n/Trans';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function BaselineErrorMessage({ thresholdResult }) {
  if (!hasBaselineError(thresholdResult)) {
    return null;
  }

  return (
    <Message type="neutral" iconColor={theme.lib.colors.failure} withIcon>
      <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.baselineErrorMessageInsufficientDataToCompute" />
      <br />
      <b>{t('in-alerting:smartAlerts.components.smartAlertDialog.baselineErrorMessageReason')}</b>
      {getErrorReason(thresholdResult)}
    </Message>
  );
}

function hasBaselineError(thresholdResult) {
  return thresholdResult && thresholdResult.errors?.length > 0;
}

function getErrorReason(thresholdResult) {
  return thresholdResult.errors[0].message;
}
