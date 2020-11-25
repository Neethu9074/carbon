import React from 'react';

import ComparisonColorSelect from 'in-custom-dashboards/widgets/BigNumber/ComparisonColorSelect';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import { timeShifts } from 'in-stores/time/shifting';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

export default function TimeShiftingForm({ form, onChange }) {
  const timeShiftField = form.get('metricConfiguration').get('timeShift');
  const showComparison = timeShiftField.value !== 0;

  return (
    <>
      <Row withoutTopMargin>
        <Col lg={6}>
          <FormGroup>
            <Label htmlFor="metic-configurator-time-shift" hasError={!timeShiftField.valid && timeShiftField.touched}>
              Time Shift
            </Label>
            <Select
              id="metic-configurator-time-shift"
              value={timeShiftField.value}
              onChange={e => {
                let value = e.target.value;
                if (value !== 'auto') {
                  value = parseInt(value, 10);
                }
                onChange(['metricConfiguration', 'timeShift'], field => field.setValue(value).setTouched(true));
              }}
              hasError={!timeShiftField.valid && timeShiftField.touched}
            >
              {timeShifts
                .filter(
                  // Some options may not be selected, but if a configuration is already persisted with this
                  // option, then we do allow it temporarily.
                  ({ offset, disallowSelection }) => disallowSelection !== true || offset === timeShiftField.value
                )
                .map(({ offset, label }) => (
                  <option key={offset} value={offset}>
                    {label}
                  </option>
                ))}
            </Select>
            <TouchedMessages field={timeShiftField} />
          </FormGroup>
        </Col>
      </Row>

      {showComparison && (
        <>
          <Row withoutTopMargin>
            <Col lg={6}>
              <ComparisonColorSelect
                label="Increase Color"
                examplePercentage="+5.24%"
                field={form.get('comparisonIncreaseColor')}
                onChange={v => onChange(['comparisonIncreaseColor'], f => f.setValue(v).setTouched(true))}
                idSuffix="increase"
              />
            </Col>
          </Row>

          <Row withoutTopMargin>
            <Col lg={6}>
              <ComparisonColorSelect
                label="Decrease Color"
                examplePercentage="-2.14%"
                field={form.get('comparisonDecreaseColor')}
                onChange={v => onChange(['comparisonDecreaseColor'], f => f.setValue(v).setTouched(true))}
                idSuffix="decrease"
              />
            </Col>
          </Row>
        </>
      )}
    </>
  );
}
