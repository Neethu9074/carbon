/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withState } from 'recompose';
import React, { Fragment } from 'react';

import RawStack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/RawStack';
import ParsedStackTrace from 'in-websites/WebsiteDashboard/tabs/Errors/ParsedStackTrace';
import CopyToClipboardButton from 'in-new-components/CopyToClipboardButton';
import { serializeLines } from 'in-new-components/StackTrace';
import ButtonGroup from 'in-new-components/ButtonGroup';

import locals from './StackTrace.mless';

export default withState(
  'forceRawStackTrace',
  'setForceRawStackTrace',
  false
)(function StackTrace({
  websiteId,
  stackTrace,
  parsedStackTrace,
  stackTraceParsingStatus,
  forceRawStackTrace,
  setForceRawStackTrace,
  buttonSize,
  children
}) {
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
                text: 'Parsed Stack Trace',
                key: 'parsed',
                size: buttonSize,
                onClick: () => setForceRawStackTrace(false)
              },
              {
                text: 'Raw Stack Trace',
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
          Copy Stack Trace
        </CopyToClipboardButton>
      </Fragment>
    ),
    content: showParsedStackTrace ? (
      <ParsedStackTrace websiteId={websiteId} lines={parsedStackTrace} />
    ) : (
      <RawStack stack={stackTrace} />
    )
  });
});
