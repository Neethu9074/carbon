/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import EntityPageMainNotification from 'in-components/EntityPageMainNotification/EntityPageMainNotification';
import ArticleContent from 'in-components/ArticleContent';
import { t } from 'in-i18n';

export default function EmptyStateContent({ cardIcon, label }) {
  return (
    <EntityPageMainNotification
      icon={cardIcon}
      title={t('in-cockpit:widgets.bizops.noProcessYet', { nolabel: label })}
      explanation={() => <ArticleContent markdownContent={t('in-cockpit:widgets.bizops.noData')} />}
    />
  );
}
