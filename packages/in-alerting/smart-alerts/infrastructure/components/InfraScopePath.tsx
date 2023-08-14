/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';

import ScopePath, { ScopeEntryType } from 'in-alerting/components/ScopePath';

interface InfraScopePathProps {
  infraName?: string;
  iconSize?: Size;
  noBottomMargin?: boolean;
  iconName: string;
}

export default function InfraScopePath({ infraName, iconSize, noBottomMargin, iconName }: InfraScopePathProps) {
  const entries = [];
  if (infraName) {
    entries.push({
      iconType: iconName,
      label: infraName,
      undefined
    } as ScopeEntryType);
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
