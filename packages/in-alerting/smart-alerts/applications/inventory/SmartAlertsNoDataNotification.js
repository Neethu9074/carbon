/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-new-components/ArticleContent';
import Message from 'in-new-components/Message';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

export default function SmartAlertsNoDataNotification() {
  return (
    <EntityPageMainNotification
      icon="lib_events_warning"
      title={t('in-alerting:smartAlerts.applications.inventory.titleNoSmartAlertsConfigured')}
      explanation={() => (
        <>
          <ArticleContent markdownContent={t('in-alerting:smartAlerts.applications.inventory.noData')} />
          {role.canConfigureGlobalAlertConfigs ? (
            <Button
              kind="create"
              // TODO: open global smart alert dialog when it's implemented later
              // href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
              // onClick={() => applicationOpenSubmitFormTracker()}
            >
              {t('in-alerting:smartAlerts.applications.inventory.createGlobalSmartAlert')}
            </Button>
          ) : (
            <Message type="warning" small withIcon>
              {t('in-alerting:smartAlerts.applications.inventory.noPersmissionToCreateGlobalSmartAlert')}
            </Message>
          )}
        </>
      )}
    />
  );
}
