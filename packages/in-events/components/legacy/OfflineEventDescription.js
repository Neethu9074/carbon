/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Link } from '@instana/components';

import CustomProblemDescription from 'in-events/components/legacy/CustomProblemDescription';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default function OfflineEventDescription({ event, latestSnapshot }) {
  const entityVerification = event.hasIn(['metadata', 'entityVerificationSnapshotId']);
  const snapshotId = getSnapshotId(event, entityVerification);

  const problemText = getOfflineEventProblemText(snapshotId, entityVerification);
  const url = snapshotId && latestSnapshot && getUrl(snapshotId, latestSnapshot);

  return entityVerification ? (
    <div>
      <CustomProblemDescription title="Last Known Process" text={problemText} className="in-event-view-event-content" />
      {url && <Link href$={url}>{t('in-events:linkViewLastProcess')}</Link>}
    </div>
  ) : (
    <div>
      <CustomProblemDescription title="Last Known Host" text={problemText} className="in-event-view-event-content" />
      {url && <Link href$={url}>{t('in-events:linkViewLastHost')}</Link>}
    </div>
  );
}

export function getSnapshotId(event, entityVerification) {
  return entityVerification
    ? event.getIn(['metadata', 'entityVerificationSnapshotId'], '')
    : event.getIn(['metadata', 'hostAvailabilitySnapshotId'], '');
}

function getOfflineEventProblemText(snapshotId, entityVerification) {
  if (entityVerification) {
    return snapshotId ? t('in-events:offLineEventProblemChangeTime') : t('in-events:offLineEventProblemNoMatch');
  }
  return snapshotId ? t('in-events:hostOffLineEventProblemChangeTime') : t('in-events:offLineEventProblemNoMatch');
}

function getUrl(snapshotId, latestSnapshot) {
  if (latestSnapshot) {
    const to = latestSnapshot.get('to');
    const from = latestSnapshot.get('from');
    const windowSize = to - from;
    const focusedMoment = to - windowSize / 2;
    const autoRefresh = false;

    return getModifiedUrlStream(params => {
      params.pathname = '/physical/dashboard';
      params.query[snapshotIdUrlParameter.name] = snapshotId;
      setTimeConfig(params, { from, to, windowSize, focusedMoment, autoRefresh });
    });
  }
}
