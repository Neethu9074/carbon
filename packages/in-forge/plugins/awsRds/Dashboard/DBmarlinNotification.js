/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Trans } from 'in-i18n';
import React from 'react';

import DashboardNotification from 'in-sdk/components/dashboard/DashboardNotification';
import Button from 'in-new-components/Button';

export default function DBmarlinNotification() {
  return (
    <DashboardNotification>
      <Trans
        i18nKey="in-forge:plugins.awsRds.dashboard.lookingForEvenDeeperDatabaseInsightsCheckOutOurIntegrationWithDBmarlin"
        components={{
          button: (
            <Button
              href="https://www.dbmarlin.com/instana-offer?utm_campaign=Instana&utm_source=Instana&utm_medium=Instana"
              target="_blank"
            />
          )
        }}
      />
    </DashboardNotification>
  );
}
