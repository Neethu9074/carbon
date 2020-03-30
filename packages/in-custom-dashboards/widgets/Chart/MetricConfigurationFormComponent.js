import React from 'react';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import ExpandableCard from 'in-new-components/ExpandableCard';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

export default function MetricConfigurationFormComponent({ axisName, index, onChange, metricForm }) {
  let title = metricForm.get('label').value || 'Unlabeled Metric';

  return (
    <ExpandableCard
      title={title}
      darkFrame
      header={
        <Tooltip content="Remove metric">
          <SvgIcon
            type="lib_actions_delete"
            onClick={() => onChange([axisName, 'metrics'], f => f.remove(index).setTouched(true))}
          />
        </Tooltip>
      }
    >
      <MetricConfigurator
        form={metricForm}
        onChange={(path, fn) => onChange([axisName, 'metrics', index, ...path], fn)}
        onChangeSource={newSource =>
          onChangeSource(
            metricForm,
            metricConfigurationForm => onChange([axisName, 'metrics', index], () => metricConfigurationForm),
            newSource
          )
        }
        withLabelConfiguration
      />
    </ExpandableCard>
  );
}
