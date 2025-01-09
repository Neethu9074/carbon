/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Tooltip } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/components/list/StatusColumnCell.mless';

export default function StatusColumnCell({ status }: { status: boolean }) {
  const tooltipLabel = status ? t('in-alerting:table.active') : t('in-alerting:table.inactive');

  return (
    <Tooltip content={tooltipLabel} delay={500}>
      <SvgIcon
        type={status ? 'lib_datetime_timerange' : 'lib_state_pending_filled'}
        className={classNames({
          [locals.enabled]: status,
          [locals.disabled]: !status
        })}
        size="xs"
      />
    </Tooltip>
  );
}
