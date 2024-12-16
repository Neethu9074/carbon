/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIcon, Tooltip } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { t } from 'in-i18n';

export default function StatusColumnCell({ status }: { status: boolean }) {
  const tooltipLabel = status ? t('in-alerting:table.active') : t('in-alerting:table.inactive');

  return (
    <Tooltip content={tooltipLabel} delay={500}>
      <SvgIcon
        type={status ? 'lib_uncheck' : 'lib_state_pending_filled'}
        color={status ? themes.default.ids.color.option.green[500] : themes.default.ids.color.option.neutral[500]}
        size="xs"
      />
    </Tooltip>
  );
}
