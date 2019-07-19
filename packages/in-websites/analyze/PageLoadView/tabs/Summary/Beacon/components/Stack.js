import { withState } from 'recompose';
import React, { Fragment } from 'react';

import BodyHeader from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/BodyHeader';
import RawStack from 'in-websites/analyze/PageLoadView/tabs/Summary/Beacon/components/RawStack';
import { javaScriptStackTraceTranslationEnabled } from 'in-services/featureFlags';
import { StackTraceLines, StackTraceLine } from 'in-new-components/StackTrace';
import Button from 'in-new-components/Button';

import locals from './Stack.mless';

export default withState('forceRawStackTrace', 'setForceRawStackTrace', false)(function Stack({
  beacon,
  forceRawStackTrace,
  setForceRawStackTrace
}) {
  const hasParsedStackTrace =
    javaScriptStackTraceTranslationEnabled &&
    beacon.stackTraceParsingStatus === 1 &&
    beacon.parsedStackTrace.length > 0;
  const showParsedStackTrace = hasParsedStackTrace && !forceRawStackTrace;

  return (
    <Fragment>
      <div className={locals.header}>
        <BodyHeader>Stack Trace</BodyHeader>

        {hasParsedStackTrace && (
          <Button kind="primaryv2" size="compact" onClick={() => setForceRawStackTrace(!forceRawStackTrace)}>
            {showParsedStackTrace ? 'Show Raw Stack Trace' : 'Show Parsed Stack Trace'}
          </Button>
        )}
      </div>
      {showParsedStackTrace ? <ParsedStackTrace beacon={beacon} /> : <RawStack stack={beacon.stackTrace} />}
    </Fragment>
  );
});

function ParsedStackTrace({ beacon }) {
  return (
    <StackTraceLines>
      {beacon.parsedStackTrace.map((line, i) => (
        <StackTraceLine key={i} {...line} />
      ))}
    </StackTraceLines>
  );
}
