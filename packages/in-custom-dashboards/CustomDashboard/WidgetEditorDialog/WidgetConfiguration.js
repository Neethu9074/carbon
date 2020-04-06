import React from 'react';

import WidgetPreview from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetPreview';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import widgets from 'in-custom-dashboards/widgets';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function WidgetConfiguration({ form, onChange }) {
  const selectedType = form.get('type').value;
  const widget = widgets[selectedType];

  return (
    <widget.Form
      form={form.get('config')}
      onChange={(path, fn) => onChange(['config', ...path], fn)}
      widgetTitleFormGroup={<TitleInput form={form} onChange={onChange} />}
      widgetPreview={<WidgetPreview form={form} onChange={onChange} />}
    />
  );
}

function TitleInput({ form, onChange }) {
  const field = form.get('title');
  return (
    <FormGroup>
      <Label htmlFor="widget-title" hasError={!field.valid && field.touched}>
        Widget Title
      </Label>
      <Input
        id="widget-title"
        type="text"
        value={field.value}
        onChange={e => onChange(['title'], field => field.setValue(e.target.value).setTouched(true))}
        hasError={!field.valid && field.touched}
      />
      <TouchedMessages field={field} />
    </FormGroup>
  );
}
