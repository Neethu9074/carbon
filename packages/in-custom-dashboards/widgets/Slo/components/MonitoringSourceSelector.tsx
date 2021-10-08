/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { capitalize } from 'in-services/formatters/string';
import ButtonGroup from 'in-components/ButtonGroup';

const MonitoringSources = ['application', 'website'] as const;
export type MonitoringSource = typeof MonitoringSources[number];

export interface MonitoringSourceSelectorProps {
  value: MonitoringSource;
  onChange: (v: MonitoringSource) => void;
}

export default function MonitoringSourceSelector({ value, onChange }: MonitoringSourceSelectorProps) {
  return (
    <ButtonGroup
      buttonPropsList={MonitoringSources.map(source => ({
        key: source,
        text: capitalize(source),
        onClick: () => onChange(source)
      }))}
      activeKey={value}
      segmented
    />
  );
}
