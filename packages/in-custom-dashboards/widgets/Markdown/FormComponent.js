import React from 'react';

import StackItem from 'in-new-components/layout/Stack/StackItem';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Header from 'in-new-components/workspace/Header';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import HelpText from 'in-components/form/HelpText';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';
import Link from 'in-components/Link';

export default function MarkdownWidgetFormComponent({ form: field, onChange, widgetTitleFormGroup, widgetPreview }) {
  return (
    <Stack space="large">
      <StackItem>
        <Header>Customize the Widget</Header>
        {widgetTitleFormGroup}
      </StackItem>

      <StackItem>
        <Header>What would you like to show?</Header>
        <FormGroup>
          <Label htmlFor="markdown-widget-markdown" hasError={!field.valid && field.touched}>
            Markdown
          </Label>
          <TextArea
            id="markdown-widget-markdown"
            rows={10}
            value={field.value}
            onChange={e => onChange([], field => field.setValue(e.target.value).setTouched(true))}
          />
          <TouchedMessages field={field} />
          <HelpText>
            You can use the{' '}
            <Link href="https://en.wikipedia.org/wiki/Markdown" external>
              standard Markdown syntax
            </Link>{' '}
            to define arbitrary text content for your dashboard.
          </HelpText>
        </FormGroup>
      </StackItem>

      <StackItem>
        <Header>Widget Preview</Header>
        {widgetPreview}
      </StackItem>
    </Stack>
  );
}
