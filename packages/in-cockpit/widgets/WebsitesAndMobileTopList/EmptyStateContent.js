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
      title={`No ${label} yet`}
      explanation={() => (
        <>
          <ArticleContent id="websitesNoData" />
          <div style={{ display: 'flex' }}>
            <Button kind="create" href$={getModifiedUrlStream(p => (p.pathname = newWebsitePathFullyQualified))}>
              Create Website
            </Button>
            <Button kind="create" href$={linkToNewMobileApp$}>
              Create Mobile App
            </Button>
          </div>
        </>
      )}
    />
  );
}
