/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment, useState } from 'react';

import { ButtonGroup } from '@instana/components';

import RawStack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/RawStack';
import ParsedStackTrace from 'in-websites/WebsiteDashboard/tabs/Errors/ParsedStackTrace';
import CopyToClipboardButton from 'in-components/CopyToClipboardButton';
import { serializeLines } from 'in-components/StackTrace';
import { t } from 'in-i18n';

import locals from './StackTrace.mless';

export default function StackTrace({
  websiteId,
  stackTrace,
  parsedStackTrace,
  stackTraceParsingStatus,
  buttonSize,
  children
}) {
  const [forceRawStackTrace, setForceRawStackTrace] = useState(false);
  const hasParsedStackTrace = stackTraceParsingStatus === 1 && parsedStackTrace.length > 0;
  const showParsedStackTrace = hasParsedStackTrace && !forceRawStackTrace;

  return children({
    actions: (
      <Fragment>
        {hasParsedStackTrace && (
          <ButtonGroup
            className={locals.buttonGroup}
            buttonPropsList={[
              {
                text: t('in-websites:websiteDashboard.tabs.errors.stackTraceButtonParsedStackTrace'),
                key: 'parsed',
                size: buttonSize,
                onClick: () => setForceRawStackTrace(false)
              },
              {
                text: t('in-websites:websiteDashboard.tabs.errors.stackTraceButtonRawStackTrace'),
                key: 'raw',
                size: buttonSize,
                onClick: () => setForceRawStackTrace(true)
              }
            ]}
            activeKey={showParsedStackTrace ? 'parsed' : 'raw'}
          />
        )}
        <CopyToClipboardButton
          kind="primaryv2"
          size={buttonSize}
          getText={() => {
            if (hasParsedStackTrace && showParsedStackTrace) {
              return serializeLines(parsedStackTrace);
            }
            return stackTrace;
          }}
        >
          {t('in-websites:websiteDashboard.tabs.errors.stackTraceButtonCopyStackTrace')}
        </CopyToClipboardButton>
      </Fragment>
    ),
    content: showParsedStackTrace ? (
      <ParsedStackTrace websiteId={websiteId} lines={parsedStackTrace} />
    ) : (
      <RawStack stack={stackTrace} />
    )
  });
}
