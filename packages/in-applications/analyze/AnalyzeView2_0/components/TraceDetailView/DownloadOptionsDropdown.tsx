/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonMenuButton, CarbonMenuItem } from '@instana/components';
import { t } from '@instana/i18n-react';

import { traceDownloadUrl, rawTraceDownloadUrl } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { TraceSummary } from 'in-types';

interface DownloadOptionsDropdownProps {
  traceId: string;
  traceSummary?: TraceSummary;
}

export function DownloadOptionsDropdown({ traceId, traceSummary }: DownloadOptionsDropdownProps): JSX.Element {
  const { trackDownloadTraceClicked } = useApplicationTracker();
  return (
    <CarbonMenuButton size="sm" kind="primary" label={t('in-applications:linkDownload')} menuAlignment="bottom">
      <CarbonMenuItem
        label={t('in-applications:linkDownloadCalls')}
        onClick={() => {
          trackDownloadTraceClicked({ rawTrace: false });
          window.open(traceDownloadUrl(traceId, traceSummary), '_blank');
        }}
      />
      <CarbonMenuItem
        onClick={() => {
          trackDownloadTraceClicked({ rawTrace: true });
          window.open(rawTraceDownloadUrl(traceId), '_blank');
        }}
        label={t('in-applications:linkDownloadRawTrace')}
      />
    </CarbonMenuButton>
  );
}
