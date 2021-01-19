import classNames from 'classnames';
import React from 'react';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { onChangeSource, duplicate } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { source } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/sli/index';
import { isInitiallyOpen } from 'in-custom-dashboards/widgets/Chart/FormComponent/autoOpenHelper';
import TimeShiftingForm from 'in-custom-dashboards/widgets/Chart/FormComponent/TimeShiftingForm';
import { getMetricId, getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import { HighlightedEffect } from 'in-new-components/SelectedElementHighlighter';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import { Li, ColumnizedContent } from 'in-new-components/lists/List';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './MetricConfiguration.mless';

export const columnDefinitions = [
  {
    forceMinimumWidth: true,
    verticallyCenter: true,
    getContent({ index, axisName, indexInAxis, getShortMetricKey }) {
      return (
        <Pill kind="info" id={getMetricId(index)}>
          {getShortMetricKey(axisName, indexInAxis)}
        </Pill>
      );
    }
  },
  {
    getContent({ metricForm }) {
      let title = getMetricLabel(metricForm.toJS());
      if (metricForm.get('timeShift').value !== 0) {
        title = (
          <Tooltip content="Dataset is time shifted">
            <span className={locals.timeShifted}>
              {title} <SvgIcon className={locals.timeShiftIndicator} size="xs" type="lib_datetime_time" />
            </span>
          </Tooltip>
        );
      }

      return (
        <div
          className={classNames(locals.title, {
            [locals.hasError]: metricForm.touched && !metricForm.hierarchyValid
          })}
        >
          {title}
        </div>
      );
    }
  },
  {
    forceMinimumWidth: true,
    getContent({ onChange, axisName, indexInAxis, metricForm }) {
      return (
        <MoreMenu kind="subtle" className={locals.more}>
          <MoreMenuButton
            icon="lib_actions_copy"
            onClick={() =>
              onChange([axisName, 'metrics'], f => f.insert(indexInAxis + 1, duplicate(metricForm)).setTouched(true))
            }
          >
            Duplicate
          </MoreMenuButton>

          <MoreMenuButton
            icon="lib_actions_delete"
            onClick={() => onChange([axisName, 'metrics'], f => f.remove(indexInAxis).setTouched(true))}
          >
            Remove dataset
          </MoreMenuButton>
        </MoreMenu>
      );
    }
  }
];

export default function MetricConfiguration(props) {
  const { axisName, index, indexInAxis, onChange, metricForm, form } = props;

  return (
    <HighlightedEffect id={getMetricId(index)}>
      {({ highlighted, ref }) => (
        <Li
          className={classNames({
            [locals.highlighted]: highlighted
          })}
          ref={ref}
          noAlternatingBg
          toggleContentOnRowClick
          highlightOpenState={false}
          initiallyOpen={isInitiallyOpen(axisName, indexInAxis)}
          renderNestedContent={() => (
            <MetricConfigurator
              form={metricForm}
              onChange={(path, fn) => onChange([axisName, 'metrics', indexInAxis, ...path], fn)}
              onChangeSource={newSource =>
                onChangeSource(
                  metricForm,
                  metricConfigurationForm =>
                    onChange([axisName, 'metrics', indexInAxis], () => metricConfigurationForm),
                  newSource
                )
              }
              withLabelConfiguration
              timeShiftConfiguration={
                <TimeShiftingForm
                  axisName={axisName}
                  index={index}
                  indexInAxis={indexInAxis}
                  onChange={onChange}
                  metricForm={metricForm}
                />
              }
              disabledDataSources={[source]}
              axisForm={form}
              axisName={axisName}
            />
          )}
        >
          <ColumnizedContent columnDefinitions={columnDefinitions} {...props} />
        </Li>
      )}
    </HighlightedEffect>
  );
}
