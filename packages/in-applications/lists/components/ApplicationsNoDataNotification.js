/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import { applicationOpenSubmitFormTracker } from 'in-applications/tracker';
import CreateApplication from 'in-applications/creation/CreateApplication';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { newApplicationView } from 'in-applications/navigation/paths';
import { newApCreationEnabled } from 'in-services/featureFlags';
import ArticleContent from 'in-new-components/ArticleContent';
import { applicationPlugins } from 'in-forge/constants';
import Button from 'in-new-components/Button';
import { role } from 'in-stores/user';

import locals from './ApplicationsNoDataNotification.mless';

export default function ApplicationsNoDataNotification() {
  return (
    <EntityPageMainNotification
      plugin={applicationPlugins.application}
      title={t('in-applications:titleNoApplicationPerspectives')}
      explanation={() => (
        <>
          <ArticleContent markdownContent={t('in-applications:applications.noData')} />
          {role.canConfigureApplications ? (
            newApCreationEnabled ? (
              <CreateApplication className={locals.button} />
            ) : (
              <Button
                kind="create"
                href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}
                onClick={() => applicationOpenSubmitFormTracker()}
              >
                {t('in-applications:titleCreateApplicationPerspective')}
              </Button>
            )
          ) : (
            <p className={locals.text}>{t('in-applications:list.textNewApplicationPerspective')}</p>
          )}
        </>
      )}
    />
  );
}
