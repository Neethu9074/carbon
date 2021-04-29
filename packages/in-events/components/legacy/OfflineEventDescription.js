/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { useObservable } from '@instana/hooks';
import { Link } from '@instana/components';
import React from 'react';

import CustomProblemDescription from 'in-events/components/legacy/CustomProblemDescription';
import { snapshotIdUrlParameter } from 'in-stores/snapshot/urlParameters';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { getSnapshotVersions } from 'in-stores/snapshot/snapshot';
import { setTimeConfig } from 'in-stores/time/config';
import { t } from 'in-i18n';

export default function OfflineEventDescription({ event }) {
  const snapshotId = event.getIn(['metadata', 'entityVerificationSnapshotId'], '');
  const snapshotVersions = useObservable(getSnapshotVersionsObservable, [snapshotId]);

  const problemText = getOfflineEventProblemText(snapshotId);
  const url = snapshotId && snapshotVersions && getUrl(snapshotId, snapshotVersions.toArray());

  return (
    <div>
      <CustomProblemDescription title="Last Known Process" text={problemText} className="in-event-view-event-content" />
      {url && <Link href$={url}>{t('in-events:linkViewLastProcess')}</Link>}
    </div>
  );
}

function getOfflineEventProblemText(snapshotId) {
  return snapshotId ? t('in-events:offLineEventProblemChangeTime') : t('in-events:offLineEventProblemNoMatch');
}

function getUrl(snapshotId, snapshotVersions = []) {
  const latestSnapshot = getLatestSnapshot(snapshotVersions);
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

function getLatestSnapshot(snapshotVersions) {
  return snapshotVersions.sort((a, b) => a.get('to') - b.get('to')).pop();
}

function getSnapshotVersionsObservable([snapshotId]) {
  return snapshotId && getSnapshotVersions(snapshotId);
}
