/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { newWebsitePathFullyQualified } from 'in-websites/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function WebsitesNoDataNotification() {
  return <RedirectWithHash to={newWebsitePathFullyQualified} />;
}
