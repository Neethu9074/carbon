/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { themes } from '@instana/design-tokens';

import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

export default function BetaBadge() {
  return (
    <Pill kind="primary" color={themes.default.ids.color.option.blue['500']}>
      {t('in-components:featureFeedback.labelBETA')}
    </Pill>
  );
}
