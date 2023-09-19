/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Message } from '@instana/components';

import { AdaptiveBaselineSuggestionResponse, Result } from 'in-types';
import { hasError } from 'in-services/util/result';
import { useTheme } from 'in-themes';
import { Trans } from 'in-i18n';

interface Props {
  readonly thresholdResult?: Result<AdaptiveBaselineSuggestionResponse>;
}

export default function AdaptiveBaselineErrorMessage({ thresholdResult }: Props) {
  const theme = useTheme();
  // There won't be errors and data in the result, so we check for the non-null message property,
  // this has priority then:
  if (thresholdResult?.data?.message) {
    return (
      <Message type="neutral" iconColor={theme.ids.color.option.neutral['800']} withIcon>
        <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.adaptiveBaselineErrorMessageInsufficientDataToCompute" />
      </Message>
    );
  }

  if (thresholdResult && hasError(thresholdResult)) {
    return (
      <Message type="neutral" iconColor={theme.ids.color.option.neutral['800']} withIcon>
        <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.adaptiveBaselineErrorMessage" />
      </Message>
    );
  }

  return null;
}
