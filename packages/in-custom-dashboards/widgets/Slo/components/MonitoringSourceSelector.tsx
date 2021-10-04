/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ButtonGroup from 'in-components/ButtonGroup';

const MonitoringSources = ['Applications', 'Websites'] as const;
type MonitoringSource = typeof MonitoringSources[number];

export interface MonitoringSourceSelectorProps {
  value: MonitoringSource;
  onChange: (v: MonitoringSource) => void;
}

export default function MonitoringSourceSelector({ value, onChange }: MonitoringSourceSelectorProps) {
  return (
    <ButtonGroup
      buttonPropsList={MonitoringSources.map(source => ({
        key: source,
        text: source,
        onClick: () => onChange(source)
      }))}
      activeKey={value}
      segmented
    />
  );
}
