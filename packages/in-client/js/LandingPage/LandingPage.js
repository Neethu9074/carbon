/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getActiveConfiguration } from 'in-client/js/LandingPage/activeConfigration';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function LandingPage() {
  const { pageKey, resolve } = getActiveConfiguration();
  const { location, createHref } = useNavigation();

  resolve(location, pageKey);

  return <RedirectWithHash from="/" href={createHref(location)} />;
}
