import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/metric';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function FormComponent({ form, onChange }) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const dynamicFocusQueryField = form.get('dynamicFocusQuery');

  return (
    <>
      <FormGroup>
        <Label htmlFor="metic-configurator-event-metric">Metric</Label>
        <Select id="metic-configurator-event-metric" value={metricField.value} disabled>
          <option value="eventCount">Event Count</option>
        </Select>
        <TouchedMessages field={metricField} />
      </FormGroup>

      <FormGroup>
        <Label
          htmlFor="metic-configurator-event-aggregation"
          hasError={!aggregationField.valid && aggregationField.touched}
        >
          Aggregation
        </Label>
        <Select id="metic-configurator-event-aggregation" value={aggregationField.value} disabled>
          {!metricField.valid && <option value="">Please select a metric</option>}
          {metricField.valid && (
            <>
              <option value="">Please select</option>
              {Object.keys(aggregationLabels).map(aggregation => (
                <option key={aggregation} value={aggregation}>
                  {aggregationLabels[aggregation]}
                </option>
              ))}
            </>
          )}
        </Select>
        <TouchedMessages field={aggregationField} />
      </FormGroup>

      <FormGroup>
        <Label
          htmlFor="metic-configurator-event-dynamic-focus-query"
          hasError={!dynamicFocusQueryField.valid && dynamicFocusQueryField.touched}
        >
          Dynamic Focus Query
        </Label>
        <Input
          id="metic-configurator-event-dynamic-focus-query"
          type="text"
          value={dynamicFocusQueryField.value}
          onChange={e => onChange(['dynamicFocusQuery'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!dynamicFocusQueryField.valid && dynamicFocusQueryField.touched}
        />
        <TouchedMessages field={dynamicFocusQueryField} />
      </FormGroup>
    </>
  );
}
