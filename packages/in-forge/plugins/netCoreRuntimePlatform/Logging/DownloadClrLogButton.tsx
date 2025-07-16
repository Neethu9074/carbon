/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { track, DOTNET_SUPPORT_CLICKED } from 'in-services/tracking/tracking';
import { SnapshotData, getSnapshot } from 'in-stores/snapshot/snapshot';
import { formatPathWithTU } from 'in-services/formatters/url';
import { t } from 'in-i18n';

interface DownloadClrLogButtonProps {
  readonly snapshotId: string;
  readonly timeConfig: TimeConfig;
  setPrepareClrLoggingEnvironmentButtonClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function DownloadClrLogButton({
  snapshotId,
  timeConfig,
  setPrepareClrLoggingEnvironmentButtonClick
}: DownloadClrLogButtonProps) {
  const snapshot = useObservable(
    getSnapshot(snapshotId, timeConfig).map(data => {
      const snapshotData = data.toJS();
      snapshotData['volatileId']['sensor_name'] = 'com.instana.agent';
      snapshotData['volatileId']['entity_id'] = 'self';
      return snapshotData;
    }),
    [snapshotId]
  );
  return (
    <Button
      icon="lib_actions_download"
      target="_blank"
      kind="secondary"
      href={getFormattedUrlForSupportInfoId(snapshot)}
      onClick={() => {
        track(DOTNET_SUPPORT_CLICKED);
        setPrepareClrLoggingEnvironmentButtonClick(state => (state ? false : true));
      }}
    >
      {t('in-forge:plugins.instanaAgent.dashboard.dotNetCollectSupportInformation')}
    </Button>
  );
}

function getFormattedUrlForSupportInfoId(clrSnapshot: SnapshotData) {
  if (!clrSnapshot) {
    return '';
  }

  return formatPathWithTU(
    `/api/host-agent/${encodeURIComponent(clrSnapshot['volatileId']['host_id'])}/clr-logs?download=true`
  );
}
