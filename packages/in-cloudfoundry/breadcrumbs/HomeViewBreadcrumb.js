/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import { applicationListFullyQualified } from 'in-cloudfoundry/navigation/paths';
import Breadcrumb from 'in-components/breadcrumb/Breadcrumb';
import { getView } from 'in-stores/navigation';

export default function HomeViewBreadcrumb() {
  return <Breadcrumb href$={getView(applicationListFullyQualified)}>Cloud Foundry Applications</Breadcrumb>;
}
