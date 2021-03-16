/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { newMobileAppPathFullyQualified } from 'in-mobile-apps/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function MobileAppsNoDataNotification() {
  return <RedirectWithHash to={newMobileAppPathFullyQualified} />;
}
