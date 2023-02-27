/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import CustomProblemDescription from 'in-events/components/legacy/CustomProblemDescription';
import { getSnapshotId, isEntityVerificationEvent } from 'in-events/components/eventUtil';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import { setTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default function OfflineEventDescription({ event, latestSnapshot }) {
  const snapshotId = getSnapshotId(event, isEntityVerificationEvent(event));

  const problemText = getOfflineEventProblemText(snapshotId, isEntityVerificationEvent(event));
  const url = useHrefToLastKnownEntity(snapshotId, latestSnapshot);

  return isEntityVerificationEvent(event) ? (
    <div>
      <CustomProblemDescription
        title={t('in-events:titleLastKnownProcess')}
        text={problemText}
        className="in-event-view-event-content"
      />
      {url && <Link href={url}>{t('in-events:linkViewLastProcess')}</Link>}
    </div>
  ) : (
    <div>
      <CustomProblemDescription
        title={t('in-events:titleLastKnownHost')}
        text={problemText}
        className="in-event-view-event-content"
      />
      {url && <Link href={url}>{t('in-events:linkGoToTheOfflineHost')}</Link>}
    </div>
  );
}

function getOfflineEventProblemText(snapshotId, entityVerification) {
  if (entityVerification) {
    return snapshotId ? t('in-events:offLineEventProblemChangeTime') : t('in-events:offLineEventProblemNoMatch');
  }
  return snapshotId ? t('in-events:hostOffLineEventProblemChangeTime') : t('in-events:offLineEventProblemNoMatch');
}

function useHrefToLastKnownEntity(snapshotId, latestSnapshot) {
  const { location, createHref } = useNavigation();

  if (!snapshotId || !latestSnapshot) return undefined;

  const to = latestSnapshot.get('to');
  const from = latestSnapshot.get('from');
  const windowSize = to - from;
  const focusedMoment = to - windowSize / 2;
  const autoRefresh = false;

  setTimeConfig(location, { to, windowSize, focusedMoment, autoRefresh });
  return createHref({
    ...location,
    pathname: '/physical/dashboard',
    query: { ...location.query, [snapshotIdUrlParameter.name]: snapshotId }
  });
}
