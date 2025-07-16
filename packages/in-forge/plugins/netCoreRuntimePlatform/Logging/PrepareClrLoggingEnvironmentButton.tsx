/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { invokeLogCollectorPrepare } from 'in-forge/plugins/instanaAgent/selfMonitoring';
import { track, DOTNET_SUPPORT_CLICKED } from 'in-services/tracking/tracking';
import { getSnapshot } from 'in-stores/snapshot';
import { t } from 'in-i18n';

interface PrepareClrLoggingEnvironmentButtonProps {
  snapshotId: string;
  timeConfig: TimeConfig;
  setPrepareClrLoggingEnvironmentButtonClick: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PrepareClrLoggingEnvironmentButton({
  snapshotId,
  timeConfig,
  setPrepareClrLoggingEnvironmentButtonClick
}: PrepareClrLoggingEnvironmentButtonProps) {
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
      icon="lib_actions_settings"
      kind="secondary"
      onClick={() => {
        if (snapshot) {
          track(DOTNET_SUPPORT_CLICKED);
          invokeLogCollectorPrepare(snapshot, setPrepareClrLoggingEnvironmentButtonClick); // converting back to ts to keep it consistent with the code file.
        }
      }}
    >
      {t('in-forge:plugins.instanaAgent.dashboard.dotNetPrepareEnvironment')}
    </Button>
  );
}
