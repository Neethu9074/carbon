import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function WidgetConfiguratorPresenter({ widget: { Form, Widget }, form, onChange }) {
  return (
    <>
      <Row>
        <Col lg={6}>
          <TitleInput form={form} onChange={onChange} />
          <Form form={form.get('config')} onChange={(path, fn) => onChange(['config', ...path], fn)} />
        </Col>
        <Col lg={6}>
          <Preview form={form} Widget={Widget} />
        </Col>
      </Row>
    </>
  );
}

function TitleInput({ form, onChange }) {
  const field = form.get('title');
  return (
    <FormGroup>
      <Label htmlFor="timeZones-widget-title" hasError={!field.valid && field.touched}>
        Title
      </Label>
      <Input
        id="timeZones-widget-title"
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

function Preview({ Widget, form }) {
  if (!form.hierarchyValid) {
    return <p>Preview not available because the widget configuration is invalid.</p>;
  }

  const config = form.get('config').toJS();
  return <Widget title={form.get('title').value} config={config} />;
}
