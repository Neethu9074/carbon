import React from 'react';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/index';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TimeShiftingForm from 'in-custom-dashboards/widgets/Chart/TimeShiftingForm';
import LocallyChangedTheme from 'in-themes/LocallyChangedTheme';
import ExpandableCard from 'in-new-components/ExpandableCard';
import Header from 'in-components/form/Header/Header';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import { light } from 'in-themes/themes';

import locals from './MetricConfigurationFormComponent.mless';

export default function MetricConfigurationFormComponent({ axisName, index, onChange, metricForm, form }) {
  let title = metricForm.get('label').value || 'Unlabeled Metric';
  title = `Metric ${index + 1}: ${title}`;

  if (metricForm.get('timeShift').value !== 0) {
    title = (
      <Tooltip content="Metric is time shifted">
        <span className={locals.timeShifted}>
          {title} <SvgIcon className={locals.timeShiftIndicator} size="xs" type="lib_datetime_time" />
        </span>
      </Tooltip>
    );
  }

  return (
    <LocallyChangedTheme theme={light}>
      <ExpandableCard
        title={title}
        darkFrame
        header={
          <Tooltip content="Remove metric">
            <SvgIcon
              type="lib_actions_delete"
              onClick={() => onChange([axisName, 'metrics'], f => f.remove(index).setTouched(true))}
              className={locals.removeIcon}
            />
          </Tooltip>
        }
      >
        <Header>What would you like to show?</Header>
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
          timeShiftConfiguration={
            <TimeShiftingForm axisName={axisName} index={index} onChange={onChange} metricForm={metricForm} />
          }
          disabledDataSources={[source]}
          axisForm={form}
          axisName={axisName}
        />
      </ExpandableCard>
    </LocallyChangedTheme>
  );
}
