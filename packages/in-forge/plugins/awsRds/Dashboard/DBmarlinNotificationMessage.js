/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */
import React from 'react';

import DBmarlinNotification from 'in-forge/plugins/awsRds/Dashboard/DBmarlinNotification';
import { t } from 'in-i18n';

export default function DBmarlinNotificationMessage() {
  return (
    <DBmarlinNotification>
      <span style={{ marginRight: '5rem' }}>{t('in-forge:plugins.awsRds.dashboard.dbMarlinDatabaseInsights')}</span>
      <a href="https://www.dbmarlin.com/instana-offer?utm_campaign=Instana&utm_source=Instana&utm_medium=Instana">
        {t('in-forge:plugins.awsRds.dashboard.dbMarlinCheckOutIntegration')}
      </a>
    </DBmarlinNotification>
  );
}
