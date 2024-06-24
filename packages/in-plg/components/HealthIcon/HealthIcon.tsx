/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';

import locals from 'in-plg/components/HealthIcon/HealthIcon.mless';

interface Props {
  severity?: number;
  explanation?: string;
  iconSize?: Size;
}

export default function HealthIcon({ severity = 0, explanation, iconSize }: Props) {
  let icon;
  if (severity <= 0) {
    icon = <SvgIcon type="lib_uncheck" color="var(--ids-color-option-green-500)" size={iconSize} />;
  } else if (severity > 0 && severity <= 5) {
    icon = (
      <div className={locals.warningIcon}>
        <SvgIcon type="lib_help_error_warning" color="var(--ids-color-option-yellow-500)" size={iconSize} />
      </div>
    );
  } else {
    icon = <SvgIcon type="lib_help_error_error_circle" color="var(--ids-color-option-red-500)" size={iconSize} />;
  }

  if (!explanation) {
    return icon;
  }
  return <Tooltip content={explanation}>{icon}</Tooltip>;
}
