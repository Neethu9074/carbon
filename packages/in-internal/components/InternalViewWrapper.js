/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
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
        <DashboardHeader
          title={t('in-internal:components.internalViewWrapper.internal')}
          contextConfigurations={[{ renderContext, contextIcon: 'lib_flame' }]}
        />
      }
    >
      <div className={locals.body}>{children}</div>
    </Sticky>
  );
}

function renderContext() {
  return (
    <Link className={locals.analyticsLink} href$={getModifiedUrlStream(p => (p.pathname = '/internal'))}>
      {t('in-internal:components.internalViewWrapper.internal')}
    </Link>
  );
}
