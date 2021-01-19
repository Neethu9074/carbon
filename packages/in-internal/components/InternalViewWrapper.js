/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import DashboardHeader from 'in-new-components/DashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Sticky from 'in-components/Sticky';
import Link from 'in-components/Link';

import locals from './InternalViewWrapper.mless';

export default function InternalViewWrapper({ children }) {
  return (
    <Sticky
      header={
        <DashboardHeader title="Internal" contextConfigurations={[{ renderContext, contextIcon: 'lib_flame' }]} />
      }
    >
      <div className={locals.body}>{children}</div>
    </Sticky>
  );
}

function renderContext() {
  return (
    <Link className={locals.analyticsLink} href$={getModifiedUrlStream(p => (p.pathname = '/internal'))}>
      Internal
    </Link>
  );
}
