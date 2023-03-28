/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIconProps } from '@instana/components';
import { TimeConfig } from '@instana/types';

import ScopePath, { ScopeEntryType } from 'in-alerting/components/ScopePath';
import { useLinkToWebsite } from 'in-websites/navigation/paths';

type Size = SvgIconProps['size'];
interface WebsiteScopePathProps {
  websiteId?: string;
  websiteName?: string;
  pageId?: string;
  pageName?: string;
  timeConfig?: TimeConfig;
  iconSize?: Size;
  showDashboardLinks?: boolean;
  noBottomMargin?: boolean;
}

export default function WebsiteScopePath({
  websiteId,
  websiteName,
  pageId,
  pageName,
  timeConfig,
  iconSize,
  showDashboardLinks,
  noBottomMargin
}: WebsiteScopePathProps) {
  const websiteHref = useLinkToWebsite(websiteId, {
    timeConfig
  });

  const websiteHrefWithPageId = useLinkToWebsite(websiteId, {
    pageId,
    timeConfig
  });

  const entries = [];

  if (websiteName) {
    const href = showDashboardLinks && websiteId ? websiteHref : undefined;
    entries.push({
      iconType: 'lib_website',
      label: websiteName,
      href
    } as ScopeEntryType);
  }

  if (pageId && pageName) {
    const href = showDashboardLinks ? websiteHrefWithPageId : undefined;
    entries.push({
      iconType: 'lib_website_page_load',
      label: pageName,
      href
    } as ScopeEntryType);
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
