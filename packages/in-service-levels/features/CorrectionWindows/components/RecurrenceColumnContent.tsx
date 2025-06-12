/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { RRule } from 'rrule';
import React from 'react';

import { CorrectionConfiguration } from '@instana/types';
import { Typography } from '@instana/components';

import WithSubscript from 'in-components/WithSubscript/WithSubscript';
import { t } from 'in-i18n';

interface RecurrenceColumnContentProps {
  item: CorrectionConfiguration;
}

export default function RecurrenceColumnContent({ item }: RecurrenceColumnContentProps) {
  const { scheduling } = item;
  const { recurrent, recurrentRule } = scheduling ?? {};

  const rrule = RRule.fromString(recurrentRule ?? '');
  const frequency = recurrent ? rrule.options.freq : null;

  const subscript =
    frequency !== null ? t('in-service-levels:general.frequency.label', { context: frequency.toString() }) : null;

  return (
    <WithSubscript subscript={subscript}>
      <Typography variant="body-regular">
        {recurrent
          ? t('in-service-levels:correctionWindowsList.recurrent')
          : t('in-service-levels:correctionWindowsList.oneTime')}
      </Typography>
    </WithSubscript>
  );
}
