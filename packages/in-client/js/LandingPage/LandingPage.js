/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { getActiveConfiguration } from 'in-client/js/LandingPage/activeConfigration';
import RedirectWithHash from 'in-components/RedirectWithHash';
import { getModifiedUrlStream } from 'in-stores/navigation';

export default function LandingPage() {
  const { pageKey, resolve } = getActiveConfiguration();
  return <RedirectWithHash from="/" to$={getModifiedUrlStream(location => resolve(location, pageKey))} />;
}
