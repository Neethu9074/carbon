/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { t } from 'in-i18n';

type HighlightDataRetentionProps = {
  metricResultPrecision: string;
};

export function HighlightDataRetention({ metricResultPrecision }: HighlightDataRetentionProps) {
  const hasApproximateData = metricResultPrecision === 'PRECISION_APPROXIMATE';

  if (hasApproximateData) {
    return <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />;
  }

  return null;
}
