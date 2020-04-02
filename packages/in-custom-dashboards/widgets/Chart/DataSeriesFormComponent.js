import React from 'react';

import MetricConfigurationFormComponent from 'in-custom-dashboards/widgets/Chart/MetricConfigurationFormComponent';
import { createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Stack from 'in-new-components/layout/Stack';
import Button from 'in-new-components/Button';

export default function DataSeriesFormComponent({ axisName, form, onChange }) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get('metrics');

  return (
    <>
      <TouchedMessages field={axisForm} />
      <TouchedMessages field={metricsForm} />

      <Stack space="small">
        {metricsForm.size > 0 && (
          <Stack space="disabled">
            {metricsForm.map((metricForm, i) => (
              <MetricConfigurationFormComponent
                key={i}
                index={i}
                metricForm={metricForm}
                onChange={onChange}
                axisName={axisName}
                form={form}
              />
            ))}
          </Stack>
        )}

        <Button
          kind="action"
          icon="lib_openclose_add_circle_outline"
          onClick={() => onChange([axisName, 'metrics'], f => f.push(createMetricForm()))}
        >
          Add Metric
        </Button>
      </Stack>
    </>
  );
}
