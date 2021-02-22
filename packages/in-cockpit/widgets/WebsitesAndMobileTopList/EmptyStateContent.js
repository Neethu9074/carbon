/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import EntityPageMainNotification from 'in-new-components/EntityPageMainNotification/EntityPageMainNotification';
import { newWebsitePathFullyQualified } from 'in-websites/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { linkToNewMobileApp$ } from 'in-mobile-apps/navigation/paths';
import ArticleContent from 'in-new-components/ArticleContent';
import Button from 'in-new-components/Button';

export default function EmptyStateContent({ cardIcon, label }) {
  return (
    <EntityPageMainNotification
      icon={cardIcon}
      title={t('in-cockpit:widgets.websites.noLabelYet', { nolabel: label })}
      explanation={() => (
        <>
          <ArticleContent markdownContent={t('in-cockpit:widgets.websites.noData')} />
          <div style={{ display: 'flex' }}>
            <Button kind="create" href$={getModifiedUrlStream(p => (p.pathname = newWebsitePathFullyQualified))}>
              {t('in-cockpit:widgets.websites.createWebsite')}
            </Button>
            <Button kind="create" href$={linkToNewMobileApp$}>
              {t('in-cockpit:widgets.websites.createMobileApp')}
            </Button>
          </div>
        </>
      )}
    />
  );
}
