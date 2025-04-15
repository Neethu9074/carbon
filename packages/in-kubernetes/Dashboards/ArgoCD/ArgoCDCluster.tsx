/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { useObservable } from '@instana/hooks';
import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { addActiveDialog, close } from 'in-components/DialogPresenter/store';
import getArgocdCluster from 'in-kubernetes/subscriptions/getArgocdCluster';
import ArgoCDDialog from 'in-kubernetes/Dashboards/ArgoCD/ArgoCDDialog';
import { pendingResult } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

interface ArgoCDClusterProps {
  snapshotId: string;
  timeConfig: TimeConfig;
}

const ArgoCDSubscription = ({ snapshotId, timeConfig }: ArgoCDClusterProps) => {
  const result =
    useObservable(getArgocdCluster({ id: snapshotId, timeConfig }), [snapshotId, timeConfig]) ?? pendingResult;

  const argoCDClusterData = result?.data ?? [];
  let iconType = 'lib_check_outline';
  if (
    argoCDClusterData.totalNumberOfApplicationsWithUnknownSyncStatus > 0 ||
    argoCDClusterData.totalNumberOfApplicationsOutOfSync > 0
  ) {
    iconType = 'lib_views_block';
  }

  const sumOfUnsynced =
    argoCDClusterData.totalNumberOfApplicationsWithUnknownSyncStatus +
    argoCDClusterData.totalNumberOfApplicationsOutOfSync;
  let label;
  if (argoCDClusterData.totalNumberOfApplications == 0) {
    label = t('in-kubernetes:argocd.noApps');
    iconType = '';
  } else if (sumOfUnsynced > 99) {
    label = t('in-kubernetes:argocd.99plusOutOfSync');
  } else if (sumOfUnsynced == 0) {
    label = t('in-kubernetes:argocd.syncstatus');
  } else {
    label = t('in-kubernetes:argocd.countOutOfSync', { count: sumOfUnsynced });
  }

  const handleClick = () => {
    addActiveDialog(
      <ArgoCDDialog
        snapshotId={snapshotId}
        timeConfig={timeConfig}
        onClose={close}
        totalApps={argoCDClusterData.totalNumberOfApplications}
        unsyncedApps={sumOfUnsynced}
        argocdServerUrl={argoCDClusterData.argocdServerUrl}
      />
    );
  };
  return (
    <>
      {argoCDClusterData && Object.keys(argoCDClusterData)?.length > 0 && (
        <Button kind="tertiary" size="compact" icon={iconType} onClick={handleClick}>
          {label}
        </Button>
      )}
    </>
  );
};
export default ArgoCDSubscription;
