/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Pill from 'in-components/Pill';
import theme from 'in-themes';
import { t } from 'in-i18n';

export default function BetaBadge() {
  return (
    <Pill kind="primary" color={theme.lib.colors.blue800}>
      {t('in-components:featureFeedback.labelBETA')}
    </Pill>
  );
}
