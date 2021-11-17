/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { getIbmzZhmcDashboard } from 'in-zhmc/navigation/paths';
import RedirectWithHash from 'in-components/RedirectWithHash';

export default function SystemDashboard({ snapshot }) {
  return <RedirectWithHash to$={getIbmzZhmcDashboard(snapshot.get('id'))} />;
}
