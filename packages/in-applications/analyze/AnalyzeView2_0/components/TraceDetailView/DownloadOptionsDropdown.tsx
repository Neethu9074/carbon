/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useRef } from 'react';

import { Button, CarbonMenuButton, CarbonMenuItem, Stack } from '@instana/components';
import { t } from '@instana/i18n-react';

import { traceDownloadUrl, rawTraceDownloadUrl } from 'in-applications/analyze/AnalyzeView2_0/traceSummary';
import { useApplicationTracker } from 'in-applications/hooks/useApplicationTracker';
import { OverlayContentProps } from 'in-components/overlays/Overlay/types';
import DropdownButton from 'in-components/Button/DropdownButton';
import { carbonButtonEnabled } from 'in-services/featureFlags';
import Overlay from 'in-components/overlays/Overlay/Overlay';
import { compositeRef } from 'in-services/util/react';
import { TraceSummary } from 'in-types';

import locals from 'in-applications/analyze/AnalyzeView2_0/components/TraceDetailView/TraceDetailView.mless';

interface DownloadOptionsDropdownProps {
  traceId: string;
  traceSummary?: TraceSummary;
}

export function DownloadOptionsDropdown({ traceId, traceSummary }: DownloadOptionsDropdownProps) {
  const ref: React.MutableRefObject<HTMLButtonElement | HTMLAnchorElement | undefined> = useRef();
  const { trackDownloadTraceClicked } = useApplicationTracker();

  if (carbonButtonEnabled) {
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

  const OverlayContent = ({ close }: OverlayContentProps) => (
    <Stack gap="disabled">
      <Button
        kind="subtle"
        noAutoMargin
        className={locals.downloadOption}
        onClick={() => {
          trackDownloadTraceClicked({ rawTrace: false });
          close();
          window.open(traceDownloadUrl(traceId, traceSummary), '_blank');
        }}
      >
        {t('in-applications:linkDownloadCalls')}
      </Button>
      <Button
        kind="subtle"
        noAutoMargin
        className={locals.downloadOption}
        onClick={() => {
          trackDownloadTraceClicked({ rawTrace: true });
          close();
          window.open(rawTraceDownloadUrl(traceId), '_blank');
        }}
      >
        {t('in-applications:linkDownloadRawTrace')}
      </Button>
    </Stack>
  );

  return (
    <Overlay withoutWrapper content={OverlayContent} align="bottomMiddle">
      {({ toggle, refSetter }) => (
        <DropdownButton
          kind="primary"
          icon="lib_actions_download"
          onClick={toggle}
          refSetter={compositeRef<HTMLElement>(refSetter, ref)}
        >
          {t('in-applications:linkDownload')}
        </DropdownButton>
      )}
    </Overlay>
  );
}
