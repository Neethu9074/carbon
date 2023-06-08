/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/legacy';

import Group from 'in-applications/analyze/components/TraceDetails/components/CallDetails/components/Group';
import { configureSyntheticEndpointsView } from 'in-applications/navigation/paths';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { t } from 'in-i18n';

import locals from './IsSynthetic.mless';

export default function IsSynthetic({ call }) {
  const { location, createHref } = useNavigation();

  if (call.synthetic) {
    return (
      <Group title={t('in-analyze:traceDetail.components.callDetails.synthetic')}>
        <div className={locals.contentWrapper}>
          {t('in-analyze:traceDetail.components.callDetails.thisCallDoesNotContributeToServiceOrApplicationKpIs')}&nbsp;
          <Link href={createHref({ ...location, pathname: configureSyntheticEndpointsView })}>
            {t('in-analyze:traceDetail.components.callDetails.configureSyntheticEndpoints')}
          </Link>
        </div>
      </Group>
    );
  } else {
    return null;
  }
}
