/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { MonitoringSource, MonitoringSources } from 'in-custom-dashboards/widgets/Slo/constants';
import ButtonGroup from 'in-components/ButtonGroup';
import { t } from 'in-i18n';

export interface MonitoringSourceSelectorProps {
  value: MonitoringSource;
  onChange: (v: MonitoringSource) => void;
}

export default function MonitoringSourceSelector({ value, onChange }: MonitoringSourceSelectorProps) {
  return (
    <ButtonGroup
      buttonPropsList={MonitoringSources.map(source => ({
        key: source,
        text: t('in-custom-dashboards:widgets.slo.monitoringSourceSelector.source', { context: source }),
        onClick: () => onChange(source)
      }))}
      activeKey={value}
      segmented
    />
  );
}
