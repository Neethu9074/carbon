import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import HelpText from 'in-components/form/HelpText';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';
import Link from 'in-components/Link';

export default function MarkdownWidgetFormComponent({ form: field, onChange }) {
  return (
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
        to define arbitray text content for your dashboard.
      </HelpText>
    </FormGroup>
  );
}
