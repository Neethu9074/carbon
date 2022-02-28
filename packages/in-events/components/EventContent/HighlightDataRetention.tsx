/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { t } from 'in-i18n';

type HighlightDataRetentionProps = {
  hasApproximateData: boolean;
};

export function HighlightDataRetention({ hasApproximateData }: HighlightDataRetentionProps) {
  if (hasApproximateData) {
    return <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />;
  }

  return null;
}
