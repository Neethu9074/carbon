/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Spacer, IconButton, DescriptionItem } from '@instana/components';
import { t } from '@instana/i18n-react';

import { getManualContentFromFields } from 'in-automation/ActionCatalog/shared';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { toHtml } from 'in-services/formatters/markdown';
import { ScoredAction } from 'in-automation/api';
import { Action } from 'in-types';

import locals from 'in-automation/components/ManualActionContent/ManualActionContent.mless';

export default function ManualActionContent({
  action,
  addCopyButton = true
}: {
  action: Action | ScoredAction;
  addCopyButton?: boolean;
}) {
  const content = getManualContentFromFields(action.fields);
  let contentText = content.value;
  if (content.encoding === 'base64') {
    contentText = atob(contentText);
  }
  const htmlContent = toHtml(contentText, { breaks: true });

  return (
    <>
      <DescriptionItem
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin, locals.manualContent)}
        title={t('in-automation:ActionCatalog.content')}
      >
        <Spacer vertical="normal" />
        <div className={locals.manualContentMarkdown}>
          <DangerousHtmlPresenter html={htmlContent} className={locals.codeBlock} />
          {addCopyButton && (
            <CopyToClipboard getText={() => contentText}>
              {refSetter => (
                <span ref={refSetter}>
                  <IconButton onClick={stopPropagationAndPreventDefault} type="lib_actions_copy" />
                </span>
              )}
            </CopyToClipboard>
          )}
        </div>
      </DescriptionItem>
    </>
  );
}
