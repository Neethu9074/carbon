/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useCallback, useState, useRef, useEffect } from 'react';

import { HorizontalIndicator, Button } from '@instana/components';
import { Disposable, just } from '@instana/observables';

import {
  CursorPaginatedResult,
  Error,
  EumBeaconByTraceBeaconsItem,
  Progress,
  TagFilterExpressionElementUnion,
  TimeConfig,
  JoinSource
} from 'in-types';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import getEumBeaconByTrace, { makeEumBeaconByTraceQuery } from 'in-eum/subscriptions/getEumBeaconByTrace';
import { formatDateWithActiveLanguage } from 'in-services/formatters/dateFnsFormatWrapper';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { useEumTracker } from 'in-eum/tracking/segTracker';
import { success } from 'in-services/util/result';
import { t } from 'in-i18n';

interface AnalyzeImpactedUsersButtonProps {
  alertType?: string;
  disabled?: boolean;
  timeConfig?: TimeConfig | null;
  joinFilterForImpactedUsers: TagFilterExpressionElementUnion;
}

export default function AnalyzeImpactedUsersButton({
  alertType,
  disabled,
  timeConfig,
  joinFilterForImpactedUsers
}: AnalyzeImpactedUsersButtonProps) {
  const [progress, setProgress] = useState<Progress | null>(null);
  const [errors, setErrors] = useState<Array<Error>>([]);
  const subscriptionRef = useRef<Disposable | null>(null);
  const { applicationsEumImpactedUsers } = useEumTracker();

  useEffect(
    () => () => {
      subscriptionRef.current?.dispose();
      subscriptionRef.current = null;
    },
    []
  );

  const onClickDownload = useCallback(() => {
    subscriptionRef.current = downloadImpactedUserBeacons(timeConfig, joinFilterForImpactedUsers, alertType)
      .startWith(null)
      .subscribe(result => {
        const loading = result?.progress?.loading ?? true;
        setProgress({
          loading: loading,
          percentage: result?.progress?.percentage ? result.progress.percentage * 100 : undefined
        });
        setErrors(result?.errors ?? []);
        if (!loading && subscriptionRef.current && result?.data) {
          download(result.data);
          subscriptionRef.current.dispose();
          subscriptionRef.current = null;
        }
      });
  }, [alertType, joinFilterForImpactedUsers, timeConfig]);
  return (
    <>
      {progress?.loading && <HorizontalIndicator progress={progress} />}
      <Button
        kind="primary"
        icon="lib_actions_download"
        onClick={e => {
          e.stopPropagation();
          onClickDownload();
          applicationsEumImpactedUsers();
        }}
        disabled={disabled || progress?.loading}
      >
        {t('in-eum:generateImpactReport.button')}
      </Button>
      {!!errors.length && (
        <DescriptionText>
          <ErroneousResultPresenter errors={errors} />
        </DescriptionText>
      )}
    </>
  );
}

function download(result: CursorPaginatedResult<EumBeaconByTraceBeaconsItem>) {
  const now = new Date();
  const nowForFileName = formatDateWithActiveLanguage(now, 'yyyyMMdd-HHmmss');
  const a = document.body.appendChild(document.createElement('a'));

  a.download = `impacts-${result.items?.length}-of-${result.totalHits}-${nowForFileName}.csv`;
  a.href = `data:text/csv;charset=utf-8,${encodeURIComponent(getCSVData(result.items ?? []))}`;
  a.click();
  document.body.removeChild(a);
}

function getCSVData(items: Array<EumBeaconByTraceBeaconsItem>): string {
  const lines = [
    [
      t('in-eum:csvDataColumnLabels.id'),
      t('in-eum:csvDataColumnLabels.name'),
      t('in-eum:csvDataColumnLabels.email'),
      t('in-eum:csvDataColumnLabels.country'),
      t('in-eum:csvDataColumnLabels.subdivision'),
      t('in-eum:csvDataColumnLabels.eumCfgLabel'),
      t('in-eum:csvDataColumnLabels.source')
    ]
  ];

  items.forEach(item => {
    lines.push([
      item.beacon.userIdOrSessionId ?? '',
      item.beacon.userName ?? '',
      item.beacon.userEmail ?? '',
      item.beacon.country ?? '',
      item.beacon.subdivision ?? '',
      item.beacon.eumCfgLabel ?? '',
      item.beacon.eumSource ?? ''
    ]);
  });

  return lines.map(line => line.join(',')).join('\n');
}

function downloadImpactedUserBeacons(
  timeConfig?: TimeConfig | null,
  joinFilterForImpactedUsers?: TagFilterExpressionElementUnion,
  alertType?: string
) {
  let joinSource = 'JOIN_SOURCE_EUM_IMPACTED_TRACES' as JoinSource;
  if (alertType === 'throughput') {
    joinSource = 'JOIN_SOURCE_APPLICATION' as JoinSource;
  }
  if (!timeConfig || !joinFilterForImpactedUsers) {
    return just(
      success<CursorPaginatedResult<EumBeaconByTraceBeaconsItem>>({
        items: [],
        canLoadMore: false,
        totalHits: 0,
        totalRepresentedItemCount: 0,
        totalRetainedItemCount: 0
      })
    );
  }

  return getEumBeaconByTrace(
    makeEumBeaconByTraceQuery({
      metrics: [
        'beaconByTrace.userIdOrSessionId',
        'beaconByTrace.user.name',
        'beaconByTrace.user.email',
        'beaconByTrace.geo.country',
        'beaconByTrace.geo.subdivision',
        'beaconByTrace.configId',
        'beaconByTrace.source'
      ],
      timeConfig,
      joinFilterExpression: joinFilterForImpactedUsers,
      distinctBy: ['beaconByTrace.userIdOrSessionId', 'beaconByTrace.configId'],
      pagination: {
        cursor: undefined,
        retrievalSize: 200
      },
      joinSource: joinSource
    })
  );
}
