/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { Button } from '@instana/components';
import { Ul, Li } from '@instana/components';

import MetricConfiguration from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricConfiguration';
import { autoOpen } from 'in-custom-dashboards/widgets/Chart/FormComponent/autoOpenHelper';
import { createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';
import { t } from 'in-i18n';

export default function DataSeriesConfigurator({ form, onChange, getShortMetricKey }) {
  const hasY2 = form.get('y2').get('metrics').size > 0;

  useEffect(
    () => {
      const axisForm = form.get('y1');
      const metricsFormSize = axisForm.get('metrics').size;
      if (!metricsFormSize) {
        autoOpen('y1', 0);
        onChange(['y1', 'metrics'], f => f.push(createMetricForm()));
      }
    },
    // Run this only once when the component renders for the first time
    // If there is no dataset selected, add one and open it by default
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      /* Only on component did mount */
    ]
  );

  return (
    <Ul>
      <DataSeriesForAxis
        form={form}
        onChange={onChange}
        axisName="y1"
        startNumber={0}
        getShortMetricKey={getShortMetricKey}
      />
      <DataSeriesForAxis
        form={form}
        onChange={onChange}
        axisName="y2"
        startNumber={form.get('y1').get('metrics').size}
        getShortMetricKey={getShortMetricKey}
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
          {t('in-custom-dashboards:widgets.formCompChart.dataConfigChart.addDataset')}
        </Button>
      </Li>
    </Ul>
  );
}

function DataSeriesForAxis({ form, axisName, onChange, startNumber, getShortMetricKey }) {
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
          getShortMetricKey={getShortMetricKey}
        />
      ))}
    </>
  );
}
