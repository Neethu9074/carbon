/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import ScopePath from 'in-new-components/Alerting/components/ScopePath';
import { getLinkToWebsite } from 'in-websites/navigation/paths';

export default function WebsiteScopePath({
  websiteId,
  websiteName,
  pageId,
  pageName,
  timeConfig,
  iconSize,
  showDashboardLinks,
  noBottomMargin
}) {
  const entries = [];

  if (websiteName) {
    entries.push({
      iconType: 'lib_website',
      label: websiteName,
      href$:
        showDashboardLinks &&
        websiteId &&
        getLinkToWebsite(websiteId, {
          timeConfig
        })
    });
  }

  if (pageId && pageName) {
    entries.push({
      iconType: 'lib_website_page_load',
      label: pageName,
      href$:
        showDashboardLinks &&
        getLinkToWebsite(websiteId, {
          pageId,
          timeConfig
        })
    });
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
