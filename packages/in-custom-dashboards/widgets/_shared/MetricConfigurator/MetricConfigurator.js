import React from 'react';

import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { timeShifts } from 'in-stores/time/shifting';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function MetricConfigurator({ form, onChange, onChangeSource, withLabelConfiguration }) {
  const sourceField = form.get('source');

  let sourceSpecificConfiguration;
  if (sourceField.value) {
    const FormComponent = sources[sourceField.value].Form;
    sourceSpecificConfiguration = <FormComponent form={form} onChange={onChange} />;
  }

  return (
    <>
      {withLabelConfiguration &&
        form.get('label').map(field => (
          <FormGroup>
            <Label htmlFor="metic-configurator-label" hasError={!field.valid && field.touched}>
              Label
            </Label>
            <Input
              id="metic-configurator-label"
              type="text"
              value={field.value}
              onChange={e => onChange(['label'], field => field.setValue(e.target.value).setTouched(true))}
              hasError={!field.valid && field.touched}
            />
            <TouchedMessages field={field} />
          </FormGroup>
        ))}

      {form.get('timeShift').map(field => (
        <FormGroup>
          <Label htmlFor="metic-configurator-time-shift" hasError={!field.valid && field.touched}>
            Time Shift
          </Label>
          <Select
            id="metic-configurator-time-shift"
            value={field.value}
            onChange={e => {
              let value = e.target.value;
              if (value !== 'auto') {
                value = parseInt(value, 10);
              }
              onChange(['timeShift'], field => field.setValue(value).setTouched(true));
            }}
            hasError={!field.valid && field.touched}
          >
            {timeShifts.map(({ offset, label }) => (
              <option key={offset} value={offset}>
                {label}
              </option>
            ))}
          </Select>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      <FormGroup>
        <Label htmlFor="metic-configurator-source" hasError={!sourceField.valid && sourceField.touched}>
          Source
        </Label>
        <Select
          id="metic-configurator-source"
          value={sourceField.value}
          onChange={e => onChangeSource(e.target.value)}
          hasError={!sourceField.valid && sourceField.touched}
        >
          <option value="">Please select</option>
          {Object.keys(sources)
            .sort((a, b) => compareIgnoreCase(sources[a].label, sources[b].label))
            .map(key => (
              <option key={key} value={key}>
                {sources[key].label}
              </option>
            ))}
        </Select>
        <TouchedMessages field={sourceField} />
      </FormGroup>

      {sourceSpecificConfiguration}
    </>
  );
}
