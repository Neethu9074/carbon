import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import FormGroup from 'in-components/form/FormGroup';
import widgets from 'in-custom-dashboards/widgets';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

export default function WidgetSelectorPresenter({ form, onChange }) {
  const field = form.get('type');

  return (
    <FormGroup>
      <Label htmlFor="widget-configurator-type" hasError={!field.valid && field.touched}>
        Widget Type
      </Label>
      <Select
        id="widget-configurator-type"
        value={field.value}
        onChange={e => onChange(['type'], field => field.setValue(e ? e.target.value : '').setTouched(true))}
        hasError={!field.valid && field.touched}
      >
        <option value="">Please select</option>
        {Object.keys(widgets)
          .sort((a, b) => compareIgnoreCase(widgets[a].label, widgets[b].label))
          .map(type => (
            <option key={type} value={type}>
              {widgets[type].label}
            </option>
          ))}
      </Select>
      <TouchedMessages field={field} />
    </FormGroup>
  );
}
