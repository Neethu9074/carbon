/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import Message from 'in-new-components/Message';
import theme from 'in-themes';

export default function BaselineErrorMessage({ thresholdResult }) {
  if (!hasBaselineError(thresholdResult)) {
    return null;
  }

  return (
    <Message type="neutral" iconColor={theme.lib.colors.failure} withIcon>
      {t('in-new-components:alerting.components.baselineErrorMessageInsufficientDataToCompute')}
      <br />
      <b>{t('in-new-components:alerting.components.baselineErrorMessageReason')}</b>
      {getErrorReason(thresholdResult)}
    </Message>
  );
}

function hasBaselineError(thresholdResult) {
  return thresholdResult && thresholdResult.errors.length > 0;
}

function getErrorReason(thresholdResult) {
  return thresholdResult.errors[0].message;
}
