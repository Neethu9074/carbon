/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { getLinkToWebsite } from 'in-websites/navigation/paths';

import locals from './WebsiteContext.mless';

export default function WebsiteContext({ websiteId, websiteLabel }) {
  return (
    <Link className={locals.link} href$={getLinkToWebsite(websiteId, { pageId: null })}>
      {websiteLabel}
    </Link>
  );
}
