import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { timeShifts } from 'in-stores/time/shifting';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

export default function TimeShiftingForm({ axisName, index, onChange, metricForm }) {
  const timeShiftField = metricForm.get('timeShift');

  return (
    <>
      <FormGroup>
        <Label
          htmlFor={`metic-configurator-${index}-time-shift`}
          hasError={!timeShiftField.valid && timeShiftField.touched}
        >
          Time Shift
        </Label>
        <Select
          id={`metic-configurator-${index}-time-shift`}
          value={timeShiftField.value}
          onChange={e => {
            let value = e.target.value;
            if (value !== 'auto') {
              value = parseInt(value, 10);
            }
            onChange([axisName, 'metrics', index, 'timeShift'], field => field.setValue(value).setTouched(true));
          }}
          hasError={!timeShiftField.valid && timeShiftField.touched}
        >
          {timeShifts
            // Some options may not be selected, but if a configuration is already persisted with this
            // option, then we do allow it temporarily.
            .filter(({ offset, disallowSelection }) => disallowSelection !== true || offset === timeShiftField.value)
            .map(({ offset, label }) => (
              <option key={offset} value={offset}>
                {label}
              </option>
            ))}
        </Select>
        <TouchedMessages field={timeShiftField} />
      </FormGroup>
    </>
  );
}
