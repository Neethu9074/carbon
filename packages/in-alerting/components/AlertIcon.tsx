/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

import { t } from 'in-i18n';

import locals from 'in-alerting/components/AlertIcon.mless';

interface Props {
  severity: number;
  enabled: boolean;
  size?: Size;
}

export default function AlertIcon({ severity, enabled, size }: Props) {
  return (
    <SvgIcon
      className={classNames({
        [locals.alertIcon]: true,
        [locals.alertIconSeverityLow]: severity <= 5,
        [locals.alertIconSeverityHigh]: severity > 5
      })}
      size={size}
      type={enabled ? 'lib_alerts_create' : 'lib_actions_pause'}
      aria-label={t('in-alerting:components.alertHeaderAriaLabelSeverity', {
        severity: severity <= 5 ? 'low' : 'high'
      })}
    />
  );
}
