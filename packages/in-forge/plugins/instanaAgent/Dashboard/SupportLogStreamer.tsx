/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { track, AGENT_SUPPORT_DOWNLOAD_CLICKED } from 'in-services/tracking/tracking';
import LogStreamer, { AggregateOptions, StateOptions } from './LogStreamer';
import { formatPathWithTU } from 'in-services/formatters/url';
import { close } from 'in-components/DialogPresenter/store';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

import locals from './SupportLogStreamer.mless';

export default function SupportLogStreamer({ snapshot }: { snapshot: SnapshotData }) {
  return (
    <LogStreamer
      snapshot={snapshot}
      action="agentCollectSupportData"
      logStreamTargetId="supportLogStreamId"
      onAggregate={checkForSupportInfoId}
      onRender={addDownloadButtonForSupportData}
    />
  );
}

function checkForSupportInfoId(data: any, agg: AggregateOptions) {
  if (data.log) {
    agg.log += data.log;
  }
  if (data.supportInfoId) {
    agg.additionalData = data.supportInfoId;
  }
}

function addDownloadButtonForSupportData(state: StateOptions, snapshot: SnapshotData) {
  return (
    <div className={locals.buttonMessageBox}>
      <Button
        icon="lib_actions_download"
        target="_blank"
        disabled={!state.additionalData}
        href={getFormattedUrlForSupportInfoId(snapshot, state.additionalData)}
        onClick={() => {
          track(AGENT_SUPPORT_DOWNLOAD_CLICKED);
          close();
        }}
      >
        {t('in-forge:plugins.instanaAgent.dashboard.downloadSupportInformation')}
      </Button>
    </div>
  );
}

function getFormattedUrlForSupportInfoId(agentSnapshot: SnapshotData, supportInfoId: string | null) {
  if (!supportInfoId) {
    return '';
  }
  return formatPathWithTU(
    `/api/host-agent/${encodeURIComponent(
      agentSnapshot?.get('volatileId')?.get('host_id')
    )}/support-info?supportInfoId=${encodeURIComponent(supportInfoId)}`
  );
}
