/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { SvgIconProps } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { getLinkToWebsite } from 'in-websites/navigation/paths';
import ScopePath from 'in-alerting/components/ScopePath';

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
  const entries = [];

  if (websiteName) {
    const href$ =
      showDashboardLinks && websiteId
        ? getLinkToWebsite(websiteId, {
            timeConfig
          })
        : undefined;
    entries.push({
      iconType: 'lib_website',
      label: websiteName,
      href$
    });
  }

  if (pageId && pageName) {
    const href$ = showDashboardLinks
      ? getLinkToWebsite(websiteId, {
          pageId,
          timeConfig
        })
      : undefined;
    entries.push({
      iconType: 'lib_website_page_load',
      label: pageName,
      href$
    });
  }

  return <ScopePath entries={entries} iconSize={iconSize} noBottomMargin={noBottomMargin} />;
}
