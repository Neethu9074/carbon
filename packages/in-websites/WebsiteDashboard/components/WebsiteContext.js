/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/legacy';

import { useLinkToWebsite } from 'in-websites/navigation/paths';

import locals from './WebsiteContext.mless';

export default function WebsiteContext({ websiteId, websiteLabel }) {
  const websiteHref = useLinkToWebsite(websiteId, { pageId: null });
  return (
    <Link className={locals.link} href={websiteHref}>
      {websiteLabel}
    </Link>
  );
}
