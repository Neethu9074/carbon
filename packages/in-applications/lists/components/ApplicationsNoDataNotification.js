/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { applicationPlugins } from 'in-forge/constants';
import { role } from 'in-stores/user';
import { t } from 'in-i18n';

import locals from './ApplicationsNoDataNotification.mless';

export default function ApplicationsNoDataNotification() {
  return (
    <EntityPageMainNotification
      plugin={applicationPlugins.application}
      title={t('in-applications:titleNoApplicationPerspectives')}
      explanation={() => (
        <>
          <ArticleContent markdownContent={t('in-applications:applications.noData')} />
          {!role.canConfigureApplications && (
            <p className={locals.text}>{t('in-applications:list.textNewApplicationPerspective')}</p>
          )}
        </>
      )}
    />
  );
}
