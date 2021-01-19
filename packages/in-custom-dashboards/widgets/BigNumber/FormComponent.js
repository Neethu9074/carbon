/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TimeShiftingForm from 'in-custom-dashboards/widgets/BigNumber/TimeShiftingForm';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { formatters } from 'in-stores/metric/formatters';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';

export default function BigNumberWidgetFormComponent({ form, onChange }) {
  return (
    <Stack space="normal">
      <Header>What would you like to show?</Header>

      <MetricConfigurator
        form={form.get('metricConfiguration')}
        onChange={(path, fn) => onChange(['metricConfiguration', ...path], fn)}
        onChangeSource={newSource =>
          onChangeSource(
            form.get('metricConfiguration'),
            metricConfigurationForm => onChange(['metricConfiguration'], () => metricConfigurationForm),
            newSource
          )
        }
        formatterSection={form.get('formatter').map(field => (
          <SelectInSection
            id="big-number-formatter"
            label="Formatter"
            value={field.value}
            onChange={e => onChange(['formatter'], field => field.setValue(e.target.value).setTouched(true))}
            hasError={!field.valid && field.touched}
            additionalContent={<TouchedMessages field={field} />}
            useAlternateBg
          >
            {formatters.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </SelectInSection>
        ))}
        withGrouping={false}
        timeShiftConfiguration={<TimeShiftingForm form={form} onChange={onChange} />}
      />
    </Stack>
  );
}
