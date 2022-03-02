/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { Message } from '@instana/components';

import { AdaptiveBaselineSuggestionResponse } from 'in-types';
import { Trans } from 'in-i18n';
import theme from 'in-themes';

interface Props {
  readonly adaptiveBaselineSuggestionResponse?: AdaptiveBaselineSuggestionResponse;
}

export default function AdaptiveBaselineErrorMessage({ adaptiveBaselineSuggestionResponse }: Props) {
  // There won't be errors in the result so we check for the non-null message property.
  if (adaptiveBaselineSuggestionResponse?.message) {
    return (
      <Message type="neutral" iconColor={theme.lib.colors.N800Dark} withIcon>
        <Trans i18nKey="in-alerting:smartAlerts.components.smartAlertDialog.adaptiveBaselineErrorMessage" />
      </Message>
    );
  }

  return null;
}
