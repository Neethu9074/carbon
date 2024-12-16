/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Message } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function SmartAlertsNoDataNotification(): JSX.Element {
  return (
    <EntityPageMainNotification
      icon="lib_events_critical"
      title={t('in-alerting:smartAlerts.titleNoSmartAlertsConfigured')}
      explanation={() => (
        <>
          <ArticleContent markdownContent={t('in-alerting:smartAlerts.applications.inventory.noData')} />
          {!role?.canConfigureGlobalApplicationSmartAlerts && (
            <Message type="warning" small withIcon fullInlineWidth>
              {t('in-alerting:smartAlerts.applications.inventory.noPersmissionToCreateGlobalSmartAlert')}
            </Message>
          )}
        </>
      )}
    />
  );
}
