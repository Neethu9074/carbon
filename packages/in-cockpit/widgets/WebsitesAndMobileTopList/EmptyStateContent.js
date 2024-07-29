/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Button } from '@instana/components';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import { newWebsitePathFullyQualified } from 'in-websites/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { useLinkToNewMobileApp } from 'in-mobile-apps/navigation/paths';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function EmptyStateContent({ cardIcon, label }) {
  const linkToNewMobileAppHref = useLinkToNewMobileApp();

  const { createHrefToPath } = useNavigation();
  return (
    <EntityPageMainNotification
      icon={cardIcon}
      title={t('in-cockpit:widgets.websites.noLabelYet', { nolabel: label })}
      explanation={() => (
        <>
          <ArticleContent markdownContent={t('in-cockpit:widgets.websites.noData')} />
          <div style={{ display: 'flex' }}>
            <Button kind="create" href={createHrefToPath(newWebsitePathFullyQualified)}>
              {t('in-cockpit:widgets.websites.createWebsite')}
            </Button>
            <Button kind="create" href={linkToNewMobileAppHref}>
              {t('in-cockpit:widgets.websites.createMobileApp')}
            </Button>
          </div>
        </>
      )}
    />
  );
}
