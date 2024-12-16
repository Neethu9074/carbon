/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { ButtonGroup } from '@instana/components';
import { Stack } from '@instana/components';

import { MonitoringSource, MonitoringSources } from 'in-custom-dashboards/widgets/SloLegacy/constants';
import { t } from 'in-i18n';

import locals from './MonitoringSourceSelector.mless';

export interface MonitoringSourceSelectorProps {
  value: MonitoringSource;
  onChange: (v: MonitoringSource) => void;
}

export default function MonitoringSourceSelector({ value, onChange }: MonitoringSourceSelectorProps) {
  return (
    <Stack gap="xxsmall">
      <ButtonGroup
        buttonPropsList={MonitoringSources.map(source => ({
          key: source,
          text: t('in-custom-dashboards:widgets.slo.monitoringSourceSelector.source', { context: source }),
          onClick: () => onChange(source)
        }))}
        activeKey={value}
        segmented
      />
      <span className={locals.subtext}>
        {t('in-custom-dashboards:widgets.slo.monitoringSourceSelector.callOut', { context: value })}
      </span>
    </Stack>
  );
}
