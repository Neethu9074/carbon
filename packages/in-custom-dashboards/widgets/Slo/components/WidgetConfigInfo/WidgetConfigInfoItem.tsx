/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { StackItem } from '@instana/components';

import { Nullish } from 'in-types';

import locals from './WidgetConfigInfo.mless';

interface WidgetConfigInfoItemProps {
  label: string;
  value: string | Nullish;
}

export default function WidgetConfigInfoItem({ label, value }: WidgetConfigInfoItemProps) {
  return (
    <StackItem>
      <div className={locals.configLabel}>{label}</div>
      <div className={locals.configValue}>{value}</div>
    </StackItem>
  );
}
