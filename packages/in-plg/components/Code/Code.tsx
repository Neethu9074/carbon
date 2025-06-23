/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Language } from 'prism-react-renderer';
import { isArray } from 'lodash';
import React from 'react';

import { Stack, Button } from '@instana/components';

import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { newOTelPageEnabled } from 'in-services/featureFlags';
import CodeComponent from 'in-components/Code';
import { t } from 'in-i18n';

import locals from 'in-plg/components/Code/Code.mless';

export interface CodeProps {
  code: string[];
  lang: Language;
  ref?: any;
  withCopy?: boolean;
  withDownload?: boolean;
  withoutCopyButton?: boolean;
  withExpandButton?: boolean;
  linesToShow?: number;
  showLineNumbers?: boolean;
}

const Code: React.FC<CodeProps> = ({
  code,
  lang,
  withDownload,
  withExpandButton = false,
  withoutCopyButton = false,
  linesToShow,
  showLineNumbers
}) => {
  let content = '';
  if (isArray(code)) {
    content = code.join('\n');
  }

  const downloadContent = () => {
    if (lang === 'yaml') {
      const blob = new Blob([content], { type: 'text/plain' });
      const file = new File([blob], 'deployment.yaml', { type: 'text/plain' });
      const anchor = document.createElement('a');
      anchor.href = URL.createObjectURL(file);
      anchor.download = 'deployment.yaml';
      anchor.click();
    }
    //not handling other download types right now!
  };

  return (
    <>
      {newOTelPageEnabled ? (
        <CodeComponent
          code={content}
          withoutCopyButton={withoutCopyButton}
          wrapperClassName={locals.wrapper}
          lang={lang}
          withExpandButton={withExpandButton}
          linesToShow={linesToShow}
          softWrap
          showLineNumbers={showLineNumbers}
        />
      ) : (
        <Stack direction="vertical" gap="xxsmall">
          <Stack direction="horizontal" gap="xxsmall" distribution="end">
            <Button
              noAutoMargin
              kind="action"
              hidden={!withDownload}
              disabled={withoutCopyButton}
              size="compact"
              onClick={() => {
                downloadContent();
              }}
            >
              {t('in-plg:agentDetails.common.download')}
            </Button>
            <CopyToClipboardButton size="compact" disabled={withoutCopyButton} kind="action" getText={() => content} />
          </Stack>
          <CodeComponent
            code={content}
            withoutCopyButton
            wrapperClassName={locals.wrapper}
            lang={lang}
            withExpandButton={withExpandButton}
            linesToShow={linesToShow}
            softWrap
            useDark
          />
        </Stack>
      )}
    </>
  );
};

export default Code;
