import React from 'react';

import MetricConfiguratorDialog from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfiguratorDialog';
import { createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Ul, Li } from 'in-new-components/lists/List';
import Button from 'in-new-components/Button';

export default function DataSeriesFormComponent({ axisName, form, onChange }) {
  const axisForm = form.get(axisName);
  const metricsForm = axisForm.get('metrics');

  return (
    <>
      <TouchedMessages field={axisForm} />
      <TouchedMessages field={metricsForm} />

      {metricsForm.size > 0 && (
        <Ul>
          {metricsForm.map((metricForm, i) => (
            <Li key={i} onClick={() => showMetricConfigurationDialog(onChange, axisName, metricForm.toJS(), i)}>
              {metricForm.get('label').value}
            </Li>
          ))}
        </Ul>
      )}

      <Button kind="create" onClick={() => showMetricConfigurationDialog(onChange, axisName)}>
        Add Metric
      </Button>
    </>
  );
}

function showMetricConfigurationDialog(onChange, axisName, metricConfiguration, i) {
  addActiveDialog(
    <MetricConfiguratorDialog
      withLabelConfiguration
      metricConfiguration={metricConfiguration}
      onFinished={changedMetricConfiguration => {
        const metricForm = createMetricForm(changedMetricConfiguration);
        onChange([axisName, 'metrics'], metricsForm => {
          if (i == null) {
            return metricsForm.push(metricForm);
          } else {
            return metricsForm.set(i, metricForm);
          }
        });
      }}
    />
  );
}
