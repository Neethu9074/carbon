/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import Group from 'in-analyze/TraceDetail/components/CallDetails/components/Group';
import { configureSyntheticEndpointsView } from 'in-applications/navigation/paths';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import Link from 'in-components/Link';
import { t } from 'in-i18n';

import locals from './IsSynthetic.mless';

export default function IsSynthetic({ call }) {
  if (call.synthetic) {
    return (
      <Group title={t('in-analyze:traceDetail.components.callDetails.synthetic')}>
        <div className={locals.contentWrapper}>
          {t('in-analyze:traceDetail.components.callDetails.thisCallDoesNotContributeToServiceOrApplicationKpIs')}&nbsp;
          <Link href$={getModifiedUrlStream(p => (p.pathname = configureSyntheticEndpointsView))}>
            {t('in-analyze:traceDetail.components.callDetails.configureSyntheticEndpoints')}
          </Link>
        </div>
      </Group>
    );
  } else {
    return null;
  }
}
