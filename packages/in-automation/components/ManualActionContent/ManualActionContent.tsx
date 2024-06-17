/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Spacer, IconButton } from '@instana/components';
import { t } from '@instana/i18n-react';

import { getManualContentFromFields } from 'in-automation/ActionCatalog/shared';
import { DescriptionItem } from 'in-components/DescriptionList/DescriptionList';
import { stopPropagationAndPreventDefault } from 'in-services/util/function';
import DangerousHtmlPresenter from 'in-components/DangerousHtmlPresenter';
import { isAIAction } from 'in-automation/ActionCatalog/shared';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { toHtml } from 'in-services/formatters/markdown';
import { ScoredAction } from 'in-automation/api';
import { Action } from 'in-types';

import locals from 'in-automation/components/ManualActionContent/ManualActionContent.mless';

const toHtmlWithLineNumbers = (text: string) => {
  const lines = text.split('\n');
  const htmlLines = lines.map(line => `<li>${line}</li>`).join('');
  return `<ol class=${locals.codeBlock}>${htmlLines}</ol>`;
};

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
  const htmlContent =
    //@ts-expect-error - can be removed from R-277
    isAIAction(action) || action.metadata?.aiOriginated
      ? toHtmlWithLineNumbers(contentText)
      : toHtml(contentText, { breaks: true });

  return (
    <>
      <DescriptionItem
        className={classNames(locals.actionModalFontSize, locals.actionDescriptionMargin, locals.manualContent)}
        title={t('in-automation:ActionCatalog.content')}
      >
        <Spacer vertical="normal" />
        <div className={locals.manualContentMarkdown}>
          <DangerousHtmlPresenter html={htmlContent} />
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
