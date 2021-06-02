/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { entityCount as infrastructureEntityCount } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure';
import { metrics as infrastructureMetrics } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure';
import { source as mobileApp } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/mobileApp';
import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { source as website } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/website';
import { source as event } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event';
import { source as sli } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { publicFormatters } from 'in-stores/metric/formatters';
import Header from 'in-new-components/workspace/Header';
import { t } from 'in-i18n';

export default function ListWidgetFormComponent({ form, onChange }) {
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
        formatterSection={form.get('formatter').map(field => (
          <SelectInSection
            id="big-number-formatter"
            label={t('in-custom-dashboards:widgets.topList.formComp.formatter')}
            value={field.value}
            onChange={e => onChange(['formatter'], field => field.setValue(e.target.value).setTouched(true))}
            hasError={!field.valid && field.touched}
            additionalContent={<TouchedMessages field={field} />}
            useAlternateBg
          >
            {publicFormatters.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </SelectInSection>
        ))}
        disabledDataSources={[
          infrastructureMetrics.source,
          infrastructureEntityCount.source,
          mobileApp,
          website,
          event,
          sli
        ]}
        maxGrouping={10}
      />
    </>
  );
}
