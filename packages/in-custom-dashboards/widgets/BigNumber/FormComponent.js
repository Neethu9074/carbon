/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Stack } from '@instana/components';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TimeShiftingForm from 'in-custom-dashboards/widgets/BigNumber/TimeShiftingForm';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

function getMetricConfiguration(form) {
  return form.get('metricConfiguration');
}

export default function BigNumberWidgetFormComponent({ form, onChange }) {
  const metricConfig = getMetricConfiguration(form);
  return (
    <Stack gap="normal">
      <Header>{t('in-custom-dashboards:widgets.bigNumber.formComponent.whatULikeShow')}</Header>

      <MetricConfigurator
        form={getMetricConfiguration(form)}
        onChange={(path, fn) => onChange(['metricConfiguration', ...path], fn)}
        onChangeSource={newSource =>
          onChangeSource(
            getMetricConfiguration(form),
            metricConfigurationForm => onChange(['metricConfiguration'], () => metricConfigurationForm),
            newSource
          )
        }
        formatterSection={form.get('formatter').map(field => {
          const source = metricConfig.get('source').value;
          const metric = metricConfig.get('metric').value;
          const aggregation = metricConfig.get('aggregation').value;

          return (
            <SelectInSection
              id="big-number-formatter"
              label={t('in-custom-dashboards:widgets.bigNumber.formComponent.formatter')}
              value={field.value}
              onChange={e => onChange(['formatter'], field => field.setValue(e.target.value).setTouched(true))}
              hasError={!field.valid && field.touched}
              additionalContent={<TouchedMessages field={field} />}
            >
              {getFormatter(source, metric, aggregation).map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          );
        })}
        withGrouping={false}
        timeShiftConfiguration={<TimeShiftingForm form={form} onChange={onChange} />}
      />
    </Stack>
  );
}
