/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import Pill from 'in-components/Pill';
import { useTheme } from 'in-themes';
import { t } from 'in-i18n';

export default function BetaBadge() {
  const theme = useTheme();
  return (
    <Pill kind="primary" color={theme.ids.color.option.blue['500']}>
      {t('in-components:featureFeedback.labelBETA')}
    </Pill>
  );
}
