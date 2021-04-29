/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Link } from '@instana/components';
import React from 'react';

import { getLinkToMobileApp } from 'in-mobile-apps/navigation/paths';

import locals from './MobileAppContext.mless';

export default function MobileAppContext({ mobileAppId, mobileAppLabel }) {
  return (
    <Link className={locals.link} href$={getLinkToMobileApp(mobileAppId, { viewId: null })}>
      {mobileAppLabel}
    </Link>
  );
}
