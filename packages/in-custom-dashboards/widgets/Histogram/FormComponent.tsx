/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item } from 'formalistic';
import React from 'react';

import { Spacer, Stack } from '@instana/components';

import AxisConfigurator from 'in-custom-dashboards/widgets/Histogram/components/AxisConfigurator';
import MetricSelector from 'in-custom-dashboards/widgets/Histogram/components/MetricSelector';
import Sections from 'in-components/workspace/Sections/Sections';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

export interface HistogramFormComponentProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
}

export default function HistogramFormComponent({ form, onChange }: HistogramFormComponentProps) {
  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.histogram.formComp.metrics')}</Header>

      <Stack gap="xsmall">
        <MetricSelector form={form} onChange={onChange} />
      </Stack>

      <Spacer vertical="medium" />

      <Header>{t('in-custom-dashboards:widgets.histogram.formComp.axisConfiguration')}</Header>

      <Sections>
        <AxisConfigurator
          form={form}
          onChange={onChange}
          label={t('in-custom-dashboards:widgets.histogram.formComp.formatter')}
          axisName="formatter"
        />
      </Sections>
    </Stack>
  );
}
