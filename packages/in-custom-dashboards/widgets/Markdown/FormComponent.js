/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
      <Header>{t('in-custom-dashboards:widgets.markdown.formComp.whatULikeShow')}</Header>

      <Sections>
        <TextAreaInSection
          label={t('in-custom-dashboards:widgets.markdown.formComp.markdown')}
          id="markdown-widget-markdown"
          rows={10}
          value={field.value}
          onChange={e => onChange([], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!field.valid && field.touched}
          actions={
            <HelpAction>
              {t('in-custom-dashboards:widgets.markdown.formComp.markdownHelpAction')}
            </HelpAction>
          }
          additionalContent={<TouchedMessages field={field} />}
        />
      </Sections>
    </Stack>
  );
}
