/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import { configureSyntheticEndpointsView } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import Link from 'in-components/Link';

import locals from './IsSynthetic.mless';

export default function IsSynthetic({ call }) {
  if (call.synthetic) {
    return (
      <Group title="Synthetic">
        <div className={locals.contentWrapper}>
          This call does not contribute to service or application KPIs.&nbsp;
          <Link href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}>
            Configure Synthetic Endpoints
          </Link>
        </div>
      </Group>
    );
  } else {
    return null;
  }
}
