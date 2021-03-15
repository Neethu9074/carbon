/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import TrackVisibility from 'react-on-screen';
import { empty } from '@instana/observables';
import React from 'react';

import getWebsiteBackendTraces from 'in-websites/subscriptions/getWebsiteBackendTraces';
import { navigateToBackendTraceFromPageLoad } from 'in-websites/tracker';
import { MoreMenu, MoreMenuButton } from 'in-new-components/MoreMenu';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import Button from 'in-new-components/Button';
import connect from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './BackendTraceButton.mless';

const InternalBackendTraceButton = connect(({ beacon }) => ({
  result: beacon.backendTraceId
    ? getWebsiteBackendTraces({
        correlationId: beacon.backendTraceId
      })
    : empty
}))(function InternalBackendTraceButton({ result }) {
  if (!result || !result.data) {
    return null;
  }

  const traces = result.data;

  if (traces.length === 0) {
    return null;
  } else if (traces.length === 1) {
    return (
      <Button
        className={locals.button}
        kind="primaryv2"
        href$={getLinkToTraceDetail(traces[0].traceId, { callId: 'ROOT' })}
        onClick={e => {
          e.stopPropagation();
          navigateToBackendTraceFromPageLoad();
        }}
        size="compact"
      >
        {t('in-websites:analyze.analyzeView.pageLoadView.backendTraceButtonViewBackendTrace')}
      </Button>
    );
  } else {
    return (
      <MoreMenu kind="primaryv2" size="compact" className={locals.button}>
        {traces.map(({ traceId }) => (
          <MoreMenuButton
            key={traceId}
            href$={getLinkToTraceDetail(traceId, { callId: 'ROOT' })}
            onClick={() => {
              navigateToBackendTraceFromPageLoad();
            }}
          >
            {t('in-websites:analyze.analyzeView.pageLoadView.backendTraceButtonID', { traceId: traceId })}
          </MoreMenuButton>
        ))}
      </MoreMenu>
    );
  }
});

export default function BackendTraceButton(props) {
  return (
    <TrackVisibility once offset={500} tag="span">
      {({ isVisible }) => isVisible && <InternalBackendTraceButton {...props} />}
    </TrackVisibility>
  );
}
