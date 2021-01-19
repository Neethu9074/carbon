/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';
import Link from 'in-components/Link';

import locals from './MobileAppContext.mless';

export default function MobileAppContext({ mobileAppId, mobileAppLabel }) {
  return (
    <Link className={locals.link} href$={getLinkToMobileApp(mobileAppId, { viewId: null })}>
      {mobileAppLabel}
    </Link>
  );
}
