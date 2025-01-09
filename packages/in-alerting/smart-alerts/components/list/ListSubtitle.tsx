/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import locals from './ListSubtitle.mless';

export function ListSubtitle({ icon, label }: { icon: string; label: string }) {
  return (
    <span className={locals.iconWrapper}>
      <SvgIcon size="s" color={themes.default.ids.color.option.neutral['700']} aria-label="icon" type={icon} />
      {label}
    </span>
  );
}
