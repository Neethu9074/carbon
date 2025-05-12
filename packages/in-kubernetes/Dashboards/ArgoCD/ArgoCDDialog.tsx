/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Tearsheet } from '@instana/ibm-products';
import { Button } from '@instana/components';
import { TimeConfig } from '@instana/types';
import { Link } from '@instana/components';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification/DashboardNotification';
import ArgoCDTable from 'in-kubernetes/Dashboards/ArgoCD/ArgoCdTable';
import { t, Trans } from 'in-i18n';

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
    label = (
      <Trans
        i18nKey="in-kubernetes:argocd.infoNotification"
        components={{
          linkArgoCD: (
            // @ts-expect-error
            <Link
              href="https://www.ibm.com/docs/en/instana-observability/current?topic=technologies-monitoring-argo-cd-public-preview"
              external
            />
          )
        }}
      />
    );
  }

  const openInNewTab = () => {
    window.open(argocdServerUrl, '_blank', 'noopener,noreferrer');
  };

  const headerActions = (
    <Button kind="primary" icon={launchIcon} onClick={openInNewTab}>
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
      selectorPrimaryFocus="#argocdApplications"
      closeIconDescription={t('in-kubernetes:argocd.close')}
      className={locals.tearsheet}
    >
      <div id="argocdApplications">
        <DashboardNotification type="neutral">
          <div className={locals.notification}>{label}</div>
        </DashboardNotification>
        {totalApps != 0 && <ArgoCDTable snapshotId={snapshotId} timeConfig={timeConfig} />}
      </div>
    </Tearsheet>
  );
};

export default ArgoCDDialog;
