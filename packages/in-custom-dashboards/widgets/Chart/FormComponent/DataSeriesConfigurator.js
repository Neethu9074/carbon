import React from 'react';

import { autoOpen } from 'in-custom-dashboards/widgets/Chart/FormComponent/autoOpenHelper';
import MetricConfiguration from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

export default function DataSeriesConfigurator({ form, onChange }) {
  const hasY2 = form.get('y2').get('metrics').size > 0;

  return (
    <Ul>
      <DataSeriesForAxis form={form} onChange={onChange} axisName="y1" startNumber={0} />
      <DataSeriesForAxis
        form={form}
        onChange={onChange}
        axisName="y2"
        startNumber={form.get('y1').get('metrics').size}
      />
      <Li noAlternatingBg>
        <Button
          kind="action"
          icon="lib_openclose_add_circle_outline"
          onClick={() => {
            const axisName = hasY2 ? 'y2' : 'y1';
            const indexInAxis = form.get(axisName).get('metrics').size;
            autoOpen(axisName, indexInAxis);
            onChange([axisName, 'metrics'], f => f.push(createMetricForm()));
          }}
        >
          Add dataset
        </Button>
      </Li>
    </Ul>
  );
}

function DataSeriesForAxis({ form, axisName, onChange, startNumber }) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get('metrics');

  return (
    <>
      {metricsForm.map((metricForm, i) => (
        <MetricConfiguration
          key={i}
          index={startNumber + i}
          indexInAxis={i}
          metricForm={metricForm}
          onChange={onChange}
          axisName={axisName}
          form={form}
        />
      ))}
    </>
  );
}
