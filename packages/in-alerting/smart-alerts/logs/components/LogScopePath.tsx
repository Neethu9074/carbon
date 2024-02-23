/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { SvgIconSizes } from '@instana/components';

import ScopePath, { ScopeEntryType } from 'in-alerting/components/ScopePath';

interface Props {
  entityLabel: string;
  iconSize?: keyof typeof SvgIconSizes;
  noBottomMargin?: boolean;
}

export default function LogScopePath({ entityLabel, iconSize, noBottomMargin }: Props) {
  const entries: ScopeEntryType[] = [
    {
      iconType: 'lib_application_logging',
      label: entityLabel
    }
  ];

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin ?? false} />;
}
