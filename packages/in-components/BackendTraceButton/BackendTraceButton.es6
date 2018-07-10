import React from 'react';

import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { twoZeroModeEnabled } from 'in-services/featureFlags';
import SvgIcon from 'in-components/SvgIcon';
import Button from 'in-components/Button';

import locals from './BackendTraceButton.mless';

export default function BackendTraceButton({ backendTraceIdResult }) {
  if (!twoZeroModeEnabled || !backendTraceIdResult) {
    return null;
  } else if (backendTraceIdResult.progress.loading) {
    return (
      <Button disabled className={locals.button} kind="secondary">
        <SvgIcon spinning type="spinner" className={locals.spinner} width="16" />
        <span className={locals.waitingText}>Checking for backend trace</span>
      </Button>
    );
  } else if (backendTraceIdResult.errors.length === 0 && backendTraceIdResult.data) {
    return (
      <Button href$={getLinkToTraceDetail(backendTraceIdResult.data)} className={locals.button} kind="secondary">
        Open corresponding backend trace
      </Button>
    );
  } else {
    return (
      <Button disabled className={locals.button} kind="secondary">
        No corresponding backend trace available
      </Button>
    );
  }
}
