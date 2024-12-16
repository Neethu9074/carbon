/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import { SupportDownloadStateDialog } from 'in-forge/plugins/instanaAgent/Dashboard/SupportDownloadStateDialog';
import { track, AGENT_PROFILER_CLICKED, AGENT_SUPPORT_INFO_CLICKED } from 'in-services/tracking/tracking';
import { profileAgent } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { SnapshotData } from 'in-stores/snapshot/snapshot';
import { t } from 'in-i18n';

import locals from './SupportButtonSection.mless';

export default function SupportSection({ snapshot }: { snapshot: SnapshotData }) {
  const supportsAgentProfiling = snapshot.getIn(['data', 'capabilities'])?.includes('agentprofiler');
  const supportsAgentSupportInfo = snapshot.getIn(['data', 'capabilities'])?.includes('agentSupportInfo');

  return (
    <div className={locals.wrapper}>
      <SupportCollectButton supportsAgentSupportInfo={supportsAgentSupportInfo} snapshot={snapshot} />
      <ProfilerButton supportsAgentProfiling={supportsAgentProfiling} snapshot={snapshot} />
    </div>
  );
}

function ProfilerButton({
  supportsAgentProfiling,
  snapshot
}: {
  supportsAgentProfiling: boolean;
  snapshot: SnapshotData;
}) {
  if (!supportsAgentProfiling) {
    return null;
  }
  return (
    <Button
      icon="lib_actions_settings"
      kind="secondary"
      disabled={!supportsAgentProfiling}
      onClick={() => {
        track(AGENT_PROFILER_CLICKED);
        profileAgent(snapshot);
      }}
    >
      {t('in-forge:plugins.instanaAgent.dashboard.profileAgent')}
    </Button>
  );
}

function SupportCollectButton({
  supportsAgentSupportInfo,
  snapshot
}: {
  supportsAgentSupportInfo: boolean;
  snapshot: SnapshotData;
}) {
  if (!supportsAgentSupportInfo) {
    return null;
  }
  return (
    <Button
      icon="lib_actions_settings"
      kind="secondary"
      disabled={!supportsAgentSupportInfo}
      onClick={() => {
        track(AGENT_SUPPORT_INFO_CLICKED);
        addActiveDialog(<SupportDownloadStateDialog snapshot={snapshot} />);
      }}
    >
      {t('in-forge:plugins.instanaAgent.dashboard.collectSupportInformation')}
    </Button>
  );
}
