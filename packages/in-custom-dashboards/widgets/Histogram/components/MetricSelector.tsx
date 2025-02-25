/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, Item, Field } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import {
  metricConfigurationPath,
  useFormatterFormSideEffects
} from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
// @ts-expect-error
import { source as application } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/application';
// @ts-expect-error
import { source as mobileApp } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp';
// @ts-expect-error
import { source as website } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
// @ts-expect-error
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
// @ts-expect-error
import { source as event } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
// @ts-expect-error
import { source as sli } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
// @ts-expect-error
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { source as bizops } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/bizops';
import { source as logs } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/logging';

interface MetricSelectorProps {
  form: MapForm<any>;
  onChange: (path: string[], updater: (f: Item) => Item) => void;
}

export default function MetricSelector({ form, onChange }: MetricSelectorProps) {
  const metricConfig = form.get(metricConfigurationPath);

  const updateForm = useFormatterFormSideEffects(form, updatedForm => {
    onChange([], () => updatedForm);
  });

  const handleOnChange = (path: string, fn: (item: Item) => Item) => {
    updateForm(form.updateIn([metricConfigurationPath, ...path] as any, fn));
  };

  const handleOnChangeSource = (newSource: Field<string>) =>
    onChangeSource(
      metricConfig,
      (metricConfigurationForm: Field<string>) =>
        updateForm(form.updateIn([metricConfigurationPath], () => metricConfigurationForm)),
      newSource
    );

  const disabledDataSources = [event, sli, application, mobileApp, website, bizops, logs];

  return (
    <Stack gap="normal">
      <MetricConfigurator
        form={metricConfig}
        onChange={handleOnChange}
        onChangeSource={handleOnChangeSource}
        withGrouping={false}
        withAggregationInMetrics={false}
        disabledDataSources={disabledDataSources}
        withUnit
      />
    </Stack>
  );
}
