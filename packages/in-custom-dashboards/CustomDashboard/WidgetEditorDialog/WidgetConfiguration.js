import React from 'react';

import WidgetPreview from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetPreview';
import SectionLabelWithSubtext from 'in-new-components/workspace/SectionLabelWithSubtext';
import InputInSection from 'in-components/form/Input/InputInSection';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import Divider from 'in-new-components/workspace/Divider';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';
import widgets from 'in-custom-dashboards/widgets';

export default function WidgetConfiguration({ form, onChange, setSlideInView }) {
  const selectedType = form.get('type').value;
  const widget = widgets[selectedType];

  return (
    <Stack space="large">
      <StackItem>
        <widget.Form
          form={form.get('config')}
          onChange={(path, fn) => onChange(['config', ...path], fn)}
          setSlideInView={setSlideInView}
        />
      </StackItem>

      <Divider />

      <Stack space="normal">
        <Header>Widget Name</Header>
        <Sections>
          <WidgetTitleInput form={form} onChange={onChange} />
        </Sections>
      </Stack>

      <WidgetPreview form={form} onChange={onChange} />
    </Stack>
  );
}

function WidgetTitleInput({ form, onChange }) {
  const field = form.get('title');
  return (
    <InputInSection
      id="widget-title"
      hasError={!field.valid && field.touched}
      label={<SectionLabelWithSubtext subtext="Optional">Name</SectionLabelWithSubtext>}
      type="text"
      value={field.value}
      onChange={e => onChange(['title'], field => field.setValue(e.target.value).setTouched(true))}
      actions={
        <HelpAction>
          Choose an optional name for this widget that will be presented above the widget content.
        </HelpAction>
      }
    />
  );
}
