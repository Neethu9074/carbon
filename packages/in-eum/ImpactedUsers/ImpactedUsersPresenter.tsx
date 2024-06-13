/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { Card, HorizontalIndicator, Li, LoadingSkeleton, Ul } from '@instana/components';
import { getIntlNumberFormatter } from '@instana/format-numbers';

import {
  ImpactedUsersMetricsResult,
  OverallStatusType,
  calculateOverallStatus,
  estimateTotalCount
} from 'in-eum/hooks/useImpactedUsers';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import { EumBeaconByTraceBeacon, TagFilterExpressionElementUnion, TimeConfig } from 'in-types';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import AnalyzeImpactedUsersButton from 'in-eum/ImpactedUsers/AnalyzeImpactedUsersButton';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { Col, Row } from 'in-components/layout/Grid';
import { hours } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './ImpactedUsersPresenter.mless';

const countFormatter = getIntlNumberFormatter();

interface ImpactedUsersPresenterProps {
  timeConfig: TimeConfig;
  metricImpacts: ImpactedUsersMetricsResult;
  downloadProp: {
    joinFilterForImpactedUsers: TagFilterExpressionElementUnion;
  };
}

export default function ImpactedUsersPresenter({
  timeConfig,
  metricImpacts,
  downloadProp
}: Readonly<ImpactedUsersPresenterProps>) {
  const { impacted, total, websitesOrMobiles } = metricImpacts;

  const overallStatus = useMemo(() => calculateOverallStatus(metricImpacts), [metricImpacts]);

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
          <Col className={locals.container}>
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
          </Col>
          {websitesOrMobiles?.progress?.loading && <LoadingSkeleton className={locals.skeleton} />}
          {!!websitesOrMobiles?.data?.items?.length && (
            <Col className={locals.container}>
              <span className={locals.label}>{t('in-eum:entityInfoLabelOfWebsiteOrMobile')}</span>
              <Ul framed={false}>
                {websitesOrMobiles.data.items.map(it => (
                  <Li key={it.beacon.eumCfgId} size="compact" className={locals.compactLi}>
                    <EumScopePath beacon={it.beacon} />
                  </Li>
                ))}
              </Ul>
            </Col>
          )}
        </Row>
        <Row withoutSideMargin>
          <Col>
            <AnalyzeImpactedUsersButton
              disabled={
                overallStatus.pending ||
                !(overallStatus.impacted.hasData && overallStatus.impacted.value && overallStatus.adjustedTimeConfig)
              }
              timeConfig={overallStatus.adjustedTimeConfig}
              {...downloadProp}
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

function EumScopePath({ beacon }: { beacon?: EumBeaconByTraceBeacon }) {
  if (beacon?.eumSource === 'web') {
    return <WebsiteScopePath websiteId={beacon.eumCfgId} websiteName={beacon.eumCfgLabel} showDashboardLinks />;
  } else if (beacon?.eumSource === 'mobile') {
    return <MobileAppScopePath mobileAppId={beacon.eumCfgId} mobileAppName={beacon.eumCfgLabel} showDashboardLinks />;
  }

  return <></>;
}
