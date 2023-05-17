/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import { useGetLinkToMobileApp } from 'in-mobile-apps/navigation/paths';

import locals from './MobileAppContext.mless';

export default function MobileAppContext({ mobileAppId, mobileAppLabel }) {
  const linkToMobileAppHref = useGetLinkToMobileApp(mobileAppId, { viewId: null });

  return (
    <Link className={locals.link} href={linkToMobileAppHref}>
      {mobileAppLabel}
    </Link>
  );
}
