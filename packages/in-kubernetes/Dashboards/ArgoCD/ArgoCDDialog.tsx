/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Tearsheet } from '@instana/ibm-products';
import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification/DashboardNotification';
import ArgoCDTable from 'in-kubernetes/Dashboards/ArgoCD/ArgoCdTable';
import { t } from 'in-i18n';

import locals from './ArgoCD.mless';

interface Props {
  snapshotId: string;
  timeConfig: TimeConfig;
  onClose: () => void;
  totalApps: number;
  unsyncedApps: number;
  argocdServerUrl: string;
}

const launchIcon = 'lib_views_external_link';

const ArgoCDDialog = ({ snapshotId, timeConfig, onClose, totalApps, unsyncedApps, argocdServerUrl }: Props) => {
  let label;
  if (totalApps == 0) {
    label = t('in-kubernetes:argocd.noAppsNotification');
  } else if (totalApps == undefined) {
    label = t('in-kubernetes:argocd.notificationError');
  } else {
    label = t('in-kubernetes:argocd.infoNotification');
  }

  const openInNewTab = () => {
    window.open(argocdServerUrl, '_blank', 'noopener,noreferrer');
  };

  const headerActions = (
    <Button kind="primary" size="compact" icon={launchIcon} onClick={openInNewTab}>
      {t('in-kubernetes:argocd.launchArgocd')}
    </Button>
  );
  return (
    //@ts-expect-error
    <Tearsheet
      headerActions={headerActions}
      title={t('in-kubernetes:argocd.title')}
      description={t('in-kubernetes:argocd.description', { unsyncedCount: unsyncedApps, totalCount: totalApps })}
      onClose={onClose}
      open
      hasCloseIcon
      closeIconDescription={t('in-kubernetes:argocd.close')}
      className={locals.tearsheet}
    >
      <DashboardNotification type="neutral">{label}</DashboardNotification>
      {totalApps != 0 && <ArgoCDTable snapshotId={snapshotId} timeConfig={timeConfig} />}
    </Tearsheet>
  );
};

export default ArgoCDDialog;
