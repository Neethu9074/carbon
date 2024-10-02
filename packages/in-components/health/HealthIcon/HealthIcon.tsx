/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from 'in-components/health/HealthIcon/HealthIcon.mless';

interface Props {
  severity?: number;
  explanation?: string;
  iconSize?: Size;
  disabled?: boolean;
}
//TODO: replace hex values with token when it is available
export default function HealthIcon({ severity = 0, explanation, iconSize, disabled }: Props) {
  let icon;
  if (severity <= 0) {
    icon = <SvgIcon type="lib_uncheck" color={disabled ? '#81BB92' : 'var(--cds-support-success)'} size={iconSize} />;
  } else if (severity > 0 && severity <= 5) {
    icon = (
      <div className={disabled ? undefined : locals.warningIcon}>
        <SvgIcon
          type="lib_help_error_warning"
          color={disabled ? '#FDDC69' : 'var(--cds-support-warning)'}
          size={iconSize}
        />
      </div>
    );
  } else {
    icon = (
      <SvgIcon
        type="lib_help_error_error_circle"
        color={disabled ? '#FFB3B8' : 'var(--cds-text-error)'}
        size={iconSize}
      />
    );
  }

  if (!explanation) {
    return icon;
  }
  return <Tooltip content={explanation}>{icon}</Tooltip>;
}
