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
import { publicFormatters } from 'in-stores/metric/formatters';
import Sections from 'in-new-components/workspace/Sections';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import { t } from 'in-i18n';

export default function BigNumberWidgetFormComponent({ form, onChange }) {
  return (
    <Stack space="normal">
      <Header>{t('in-custom-dashboards:widgets.bigNumber.formComponent.whatULikeShow')}</Header>

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
          <Sections>
            <SelectInSection
              id="big-number-formatter"
              label={t('in-custom-dashboards:widgets.bigNumber.formComponent.formatter')}
              value={field.value}
              onChange={e => onChange(['formatter'], field => field.setValue(e.target.value).setTouched(true))}
              hasError={!field.valid && field.touched}
              additionalContent={<TouchedMessages field={field} />}
            >
              {publicFormatters.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          </Sections>
        ))}
        withGrouping={false}
        timeShiftConfiguration={<TimeShiftingForm form={form} onChange={onChange} />}
      />
    </Stack>
  );
}
