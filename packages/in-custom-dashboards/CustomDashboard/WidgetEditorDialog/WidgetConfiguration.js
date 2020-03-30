import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import widgets from 'in-custom-dashboards/widgets';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function WidgetConfiguration({ form, onChange }) {
  const selectedType = form.get('type').value;
  const widget = widgets[selectedType];

  return (
    <>
      <widget.Form form={form.get('config')} onChange={(path, fn) => onChange(['config', ...path], fn)} />

      <Header>Customize the Widget</Header>
      <TitleInput form={form} onChange={onChange} />

      <Header>Widget Preview</Header>
      <Preview form={form} />
    </>
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
      <HelpText>The widget will be placed into a box with this text as its title.</HelpText>
    </FormGroup>
  );
}

function Preview({ form }) {
  if (!form.hierarchyValid) {
    return <p>Preview not available because the widget configuration is invalid.</p>;
  }

  const widget = widgets[form.get('type').value];
  const config = form.get('config').toJS();
  return <widget.Widget title={form.get('title').value} config={config} isPreview />;
}
