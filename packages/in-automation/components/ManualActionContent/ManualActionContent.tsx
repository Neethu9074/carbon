/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { IconButton, Typography, FormGroup, Label } from '@instana/components';
import { Field } from '@instana/types';

import { GenerateAIActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateManualAction/useGenerateAIActionForm';
import FeedbackComponent from 'in-automation/AutomationCard/GenerateAI/FeedbackComponent';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { base64ToUtf8 } from 'in-automation/utils/actionField';
import AISlugIcon from 'in-automation/components/AISlugIcon';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { toHtml } from 'in-services/formatters/markdown';
import { t } from 'in-i18n';

import locals from './ManualActionContent.mless';

export default function ManualActionContent({
  content,
  addCopyButton = false,
  actionName,
  withAISlug = false,
  showFeedback = false,
  form,
  setForm
}: {
  content: Field;
  form?: GenerateAIActionForm;
  setForm?: React.Dispatch<React.SetStateAction<GenerateAIActionForm>>;
  addCopyButton?: boolean;
  actionName?: string;
  withAISlug?: boolean;
  showFeedback?: boolean;
}) {
  const promptForm = form?.get('prompt');

  const eventName = promptForm?.get('eventName').value;
  const eventDescription = promptForm?.get('eventDescription').value;
  const eventEntityType = promptForm?.get('eventEntityType').value;

  const generateAIActionPayload = {
    eventName,
    eventDescription,
    eventEntityType
  };

  let plaintextContent = content.value;
  if (content.encoding === 'base64') {
    plaintextContent = base64ToUtf8(plaintextContent);
  }
  // We trim the content because markdown-it rendering breaks if theres leading whitespace
  const htmlContent = toHtml(plaintextContent.trimStart(), { breaks: true });
  const trackerPayload = {
    prompt: generateAIActionPayload,
    generatedContent: plaintextContent.trimStart(),
    type: 'manual'
  };

  return (
    <>
      {actionName && (
        <FormGroup>
          <Label>{t('in-automation:actionName')}</Label>
          <Typography variant="heading-01">{actionName}</Typography>
        </FormGroup>
      )}
      <FormGroup>
        {withAISlug ? (
          <div className={locals.header}>
            <Typography variant="heading-200" component="h2">
              {t('in-automation:titleContentReadOnly')}
            </Typography>
          </div>
        ) : (
          <Typography variant="heading-01">{t('in-automation:ActionCatalog.content')}</Typography>
        )}
        <div className={locals.manualContentMarkdown}>
          <DangerousHtmlPresenter html={htmlContent} className={locals.codeBlock} />
          {addCopyButton && (
            <CopyToClipboard getText={() => plaintextContent}>
              {refSetter => (
                <span id="copy_action_button" ref={refSetter}>
                  <IconButton onClick={stopPropagationAndPreventDefault} type="lib_actions_copy" />
                </span>
              )}
            </CopyToClipboard>
          )}
          {withAISlug && (
            <div className={locals.aiSlug}>
              <AISlugIcon />
            </div>
          )}
        </div>
        {showFeedback && form && setForm && (
          <FeedbackComponent
            trackerPayload={trackerPayload}
            form={form.get('action')}
            setForm={actionForm => setForm(form => form.updateIn(['action'], actionForm))}
          />
        )}
      </FormGroup>
    </>
  );
}
