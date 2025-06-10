/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { Card, DataTable, HorizontalIndicator, LoadingSkeleton, Spacer } from '@instana/components';
import { getIntlNumberFormatter } from '@instana/format-numbers';

import {
  ImpactedUsersMetricsResult,
  OverallStatusType,
  calculateOverallStatus,
  estimateTotalCount
} from 'in-eum/hooks/useImpactedUsers';
// @ts-expect-error TS migration: No types available for 'in-services/entityUtils'
import * as entityUtils from 'in-services/entityUtils';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import AnalyzeImpactedUsersButton from 'in-eum/ImpactedUsers/AnalyzeImpactedUsersButton';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { Col, Row } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard';
import { hours } from 'in-services/time';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from './ImpactedUsersPresenter.mless';

const countFormatter = getIntlNumberFormatter();

interface ImpactedUsersPresenterProps {
  entityType?: string | unknown;
  eventId?: string;
  timeConfig: TimeConfig;
  metricImpacts: ImpactedUsersMetricsResult;
  isKPI: boolean;
}

export default function ImpactedUsersPresenter({
  entityType,
  eventId,
  timeConfig,
  metricImpacts,
  isKPI
}: Readonly<ImpactedUsersPresenterProps>) {
  const { impacted, total, websitesOrMobiles } = metricImpacts;

  const overallStatus = useMemo(() => calculateOverallStatus(metricImpacts), [metricImpacts]);
  const totalHits = websitesOrMobiles?.data?.totalHits;

  const carbonHeaders: Array<{ key: string; header: string }> = [
    {
      key: 'websiteAndMobileAppName',
      header: t('in-eum:webitesMobileAppsColumnLabel', { count: totalHits ? totalHits : 0 })
    },
    {
      key: 'impactedUsers',
      header: t('in-eum:titleImpactedUsers')
    }
  ];
  const carbonRows =
    websitesOrMobiles?.data?.items?.map(it => ({
      id: it.result.eumCfgId,
      websiteAndMobileAppName: it.result.eumCfgLabel,
      impactedUsers: it.result.impactedUsers
    })) || [];

  if (isKPI) {
    return (
      <KpiCard
        title={t('in-eum:titleImpactedUsers')}
        value={
          overallStatus?.impacted?.hasData === undefined ? (
            <LoadingSkeleton className={locals.skeleton} />
          ) : (
            `${overallStatus?.impacted?.hasData ? overallStatus.impacted.value : '-'}` +
            `${overallStatus?.total?.hasData ? ` / ${overallStatus.total.value}` : ''}`
          )
        }
        raw
      />
    );
  }
  return (
    <>
      {overallStatus.pending && <HorizontalIndicator progress={overallStatus.progress} />}
      <Card
        title={t('in-eum:titleImpactedUsers')}
        leftHeaderContent={
          overallStatus.adjustedTimeConfig?.reduced ? (
            <MultiLineToolTipIcon
              lines={[explainTheEstimation(overallStatus, timeConfig)]}
              label={t('in-eum:lastHoursOfTheIssue', {
                duration: Math.round(overallStatus.adjustedTimeConfig.windowSize / hours.toMillis(1))
              })}
            />
          ) : undefined
        }
      >
        {!!overallStatus.errors.length && (
          <DescriptionText>
            <ErroneousResultPresenter errors={overallStatus.errors} />
          </DescriptionText>
        )}
        <Row withoutSideMargin>
          <Col className={locals.container} lg={12}>
            <span className={locals.label}>{t('in-eum:labelImpactedUsers')}</span>
            {impacted?.state === 'pending' ? (
              <LoadingSkeleton className={locals.skeleton} />
            ) : (
              <>{overallStatus.impacted.hasData ? overallStatus.impacted.value : '-'}</>
            )}
            {total?.state === 'pending' ? (
              <LoadingSkeleton className={locals.skeleton} />
            ) : (
              <>{overallStatus.total.hasData ? ` / ${overallStatus.total.value}` : ''}</>
            )}
            <Spacer horizontal="xxsmall" />
            <span className={locals.DescriptionText}>{t('in-eum:countTextImpactedUsers')}</span>
          </Col>
        </Row>
        {entityUtils.isApplicationEntity(entityType) ? (
          <Row withoutSideMargin>
            <Col lg={12}>
              <DataTable headers={carbonHeaders} rows={carbonRows} isSearchEnabled={false} />
              {carbonRows && carbonRows?.length === 0 && <NoDataAvailable height={150} />}
            </Col>
          </Row>
        ) : null}
        <Row withoutSideMargin>
          <Col>
            <AnalyzeImpactedUsersButton
              entityType={entityType}
              eventId={eventId}
              disabled={
                overallStatus.pending ||
                !(
                  overallStatus.impacted.hasData &&
                  overallStatus.impacted.value &&
                  overallStatus.timeForTraceEstimation
                )
              }
            />
          </Col>
        </Row>
      </Card>
    </>
  );
}

function explainTheEstimation(overallStatus: OverallStatusType, timeConfig: TimeConfig): string {
  if (
    overallStatus.traceEstimation?.hasData &&
    overallStatus.timeForTraceEstimation &&
    overallStatus.adjustedTimeConfig?.whyReduce === 'too-many-calls'
  ) {
    const estimatedTotal = estimateTotalCount(
      overallStatus.timeForTraceEstimation,
      overallStatus.traceEstimation.value,
      timeConfig
    );
    return t('in-eum:approximateDataIndicator.tooManyCallsWithEstimation', {
      estimatedCount: countFormatter(Math.round(estimatedTotal / 1_000_000) * 1_000_000)
    });
  }

  if (overallStatus.adjustedTimeConfig?.whyReduce === 'duration-too-long') {
    return t('in-eum:approximateDataIndicator.durationTooLong');
  }

  return t('in-eum:approximateDataIndicator.tooManyCalls');
}
