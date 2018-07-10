import React from 'react';

import BackendTraceButton from 'in-components/BackendTraceButton';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import Button from 'in-components/Button';

import locals from './PageLoadAndBackendTraceButtons.mless';

export default function PageLoadAndBackendTraceButtons(props) {
  const { pageLoadTraceLink, backendTraceIdResult } = props;
  if (!showPageLoadTraceLink(props) && !twoZeroModeEnabled) {
    return null;
  }

  return (
    <div className={locals.buttonContainer + ' pull-right'}>
      {showPageLoadTraceLink(props) && (
        <Button href={pageLoadTraceLink} className={locals.button} kind="secondary">
          Open page load trace
        </Button>
      )}
      <BackendTraceButton backendTraceIdResult={backendTraceIdResult} />
    </div>
  );
}

function showPageLoadTraceLink({ pageLoadTraceLink, pageLoadTraceId, selectedTraceId }) {
  return pageLoadTraceLink && pageLoadTraceId !== selectedTraceId;
}
