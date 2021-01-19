/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TextAreaInSection from 'in-components/form/TextArea/TextAreaInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import Header from 'in-new-components/workspace/Header';
import Stack from 'in-new-components/layout/Stack';

export default function MarkdownWidgetFormComponent({ form: field, onChange }) {
  return (
    <Stack space="normal">
      <Header>What would you like to show?</Header>

      <Sections>
        <TextAreaInSection
          label="Markdown"
          id="markdown-widget-markdown"
          rows={10}
          value={field.value}
          onChange={e => onChange([], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!field.valid && field.touched}
          actions={
            <HelpAction>
              You can use the standard Markdown syntax to define arbitrary text content for your dashboard.
            </HelpAction>
          }
          additionalContent={<TouchedMessages field={field} />}
        />
      </Sections>
    </Stack>
  );
}
