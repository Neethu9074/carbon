/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import DashboardHeader from 'in-components/DashboardHeader';
import { getModifiedUrlStream } from 'in-stores/navigation';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

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
