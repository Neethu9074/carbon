import React from 'react';

import { Reorderer, MetricsForAxis } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import DataSeriesConfigurator from 'in-custom-dashboards/widgets/Chart/FormComponent/DataSeriesConfigurator';
import { getShortMetricKey } from 'in-custom-dashboards/widgets/Pie/util';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import Divider from 'in-new-components/workspace/Divider';
import { formatters } from 'in-stores/metric/formatters';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';

export default function PieChartWidgetFormComponent({ form, onChange }) {
  return (
    <Stack space="large">
      <Stack space="normal">
        <Header>Datasets: What data do you want to visualize?</Header>
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
            helpText="Drag and drop datasets to reorder them."
          />
        </Reorderer>
      </Stack>

      <Divider />

      <Stack space="normal">
        <Header>Data Presentation: How do you want to present the data?</Header>

        {form.getIn(['y1', 'formatter']).map(field => (
          <Sections>
            <SelectInSection
              id={`axis-y1-formatter`}
              label="Formatter"
              value={field.value}
              onChange={e => onChange(['y1', 'formatter'], field => field.setValue(e.target.value).setTouched(true))}
              hasError={!field.valid && field.touched}
              additionalContent={<TouchedMessages field={field} />}
            >
              {formatters.map(({ id, label }) => (
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
