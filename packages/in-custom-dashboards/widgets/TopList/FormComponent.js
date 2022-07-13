/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import {
  entityCount as infrastructureEntityCount,
  metrics as infrastructureMetrics
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure';
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { source as event } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
import { source as sli } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { getFormatter } from 'in-custom-dashboards/widgets/_shared/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/workspace/Header';
import { t } from 'in-i18n';

function getMetricConfiguration(form) {
  return form.get('metricConfiguration');
}

export default function ListWidgetFormComponent({ form, onChange }) {
  const metricConfig = getMetricConfiguration(form);

  return (
    <>
      <Header>{t('in-custom-dashboards:widgets.topList.formComp.whatULikeShow')}</Header>
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
        formatterSection={form.get('formatter').map(field => {
          const source = metricConfig.get('source').value;
          const metric = metricConfig.get('metric').value;
          const aggregation = metricConfig.get('aggregation').value;

          return (
            <SelectInSection
              id="big-number-formatter"
              label={t('in-custom-dashboards:widgets.topList.formComp.formatter')}
              value={field.value}
              onChange={e => onChange(['formatter'], field => field.setValue(e.target.value).setTouched(true))}
              hasError={!field.valid && field.touched}
              additionalContent={<TouchedMessages field={field} />}
              useAlternateBg
            >
              {getFormatter(source, metric, aggregation).map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </SelectInSection>
          );
        })}
        disabledDataSources={[infrastructureMetrics.source, infrastructureEntityCount.source, event, sli]}
        maxGrouping={10}
      />
    </>
  );
}
