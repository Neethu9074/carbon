/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Reorderer, MetricsForAxis } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import DataSeriesConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/DataSeriesConfigurator';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Pie/util';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { publicFormatters } from 'in-stores/metric/formatters';
import Sections from 'in-new-components/workspace/Sections';
import Divider from 'in-new-components/workspace/Divider';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-components/layout/Stack';
import { t } from 'in-i18n';

export default function PieChartWidgetFormComponent({ form, onChange }) {
  return (
    <Stack space="large">
      <Stack space="normal">
        <Header>{t('in-custom-dashboards:widgets.pie.formComponent.datasets')}</Header>
        <DataSeriesConfigurator form={form} onChange={onChange} getShortMetricKey={getShortMetricKey} />
      </Stack>

      <Divider />

      <Stack space="normal">
        <Reorderer onChange={onChange}>
          <MetricsForAxis
            form={form}
            onChange={onChange}
            axisName="y1"
            startIndex={0}
            getShortMetricKey={getShortMetricKey}
            helpText={t('in-custom-dashboards:widgets.pie.formComponent.dragDropDatasetsReorder')}
          />
        </Reorderer>
      </Stack>

      <Divider />

      <Stack space="normal">
        <Header>{t('in-custom-dashboards:widgets.pie.formComponent.dataPresentation')}</Header>

        {form.getIn(['y1', 'formatter']).map(field => (
          <Sections>
            <SelectInSection
              id={`axis-y1-formatter`}
              label={t('in-custom-dashboards:widgets.pie.formComponent.formatter')}
              value={field.value}
              onChange={e => onChange(['y1', 'formatter'], field => field.setValue(e.target.value).setTouched(true))}
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
      </Stack>
    </Stack>
  );
}
