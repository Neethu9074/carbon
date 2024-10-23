/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { IconButton, Typography, FormGroup, Label } from '@instana/components';
import { Field } from '@instana/types';

import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import AISlugIcon from 'in-automation/components/AISlugIcon';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { toHtml } from 'in-services/formatters/markdown';
import { t } from 'in-i18n';

import locals from './ManualActionContent.mless';

export default function ManualActionContent({
  content,
  addCopyButton = false,
  actionName,
  withAISlug = false
}: {
  content: Field;
  addCopyButton?: boolean;
  actionName?: string;
  withAISlug?: boolean;
}) {
  let plaintextContent = content.value;
  if (content.encoding === 'base64') {
    plaintextContent = atob(plaintextContent);
  }
  // We trim the content because markdown-it rendering breaks if theres leading whitespace
  const htmlContent = toHtml(plaintextContent.trimStart(), { breaks: true });

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
      </FormGroup>
    </>
  );
}
