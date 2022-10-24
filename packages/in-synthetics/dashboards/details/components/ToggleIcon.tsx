/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { SvgIcon } from '@instana/components';

import locals from './ToggleIcon.mless';

interface ToggleProps {
  expanded: boolean;
}

export default function ToggleIcon({ expanded }: ToggleProps) {
  return <SvgIcon className={locals.icon} type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'} size="s" />;
}
