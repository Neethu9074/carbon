/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Button } from '@instana/components';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import { useLinkToWebsite } from 'in-websites/navigation/paths';
import { t } from 'in-i18n';

import locals from './Content.mless';

export default function EumWebsiteHttpdDashboard({ snapshot }: { snapshot: any }) {
  const websiteId = snapshot.get('data').get('key');
  const websiteHref = useLinkToWebsite(websiteId);

  return (
    <>
      {websiteId && websiteHref && (
        <div className={locals.mainSection}>
          <Button kind="primary" icon="lib_website" href={websiteHref}>
            {t('in-forge:plugins.eum.dashboard.openDashboard')}
          </Button>
        </div>
      )}

      <DashboardNotification type="info">
        {t('in-forge:plugins.eum.dashboard.thereIsNoFurtherInformationAboutThisEntity')}
      </DashboardNotification>
    </>
  );
}
