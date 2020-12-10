import React from 'react';

import MetricConfigurator from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/MetricConfigurator';
import { onChangeSource } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TimeShiftingForm from 'in-custom-dashboards/widgets/BigNumber/TimeShiftingForm';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { formatters } from 'in-stores/metric/formatters';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

export default function BigNumberWidgetFormComponent({ form, onChange, widgetTitleFormGroup, widgetPreview }) {
  return (
    <>
      <Header>What would you like to show?</Header>

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
        widgetPreview={widgetPreview}
        customLabelFormGroup={widgetTitleFormGroup}
        formatterFormGroup={form.get('formatter').map(field => (
          <FormGroup>
            <Label htmlFor="big-number-formatter" hasError={!field.valid && field.touched}>
              Formatter
            </Label>
            <Select
              id="big-number-formatter"
              value={field.value}
              onChange={e => onChange(['formatter'], field => field.setValue(e.target.value).setTouched(true))}
              hasError={!field.valid && field.touched}
            >
              {formatters.map(({ id, label }) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </Select>
            <TouchedMessages field={field} />
          </FormGroup>
        ))}
        withGrouping={false}
        timeShiftConfiguration={<TimeShiftingForm form={form} onChange={onChange} />}
      />
    </>
  );
}
