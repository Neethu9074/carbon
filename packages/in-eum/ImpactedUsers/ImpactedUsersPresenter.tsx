/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo } from 'react';

import { Card, HorizontalIndicator, Li, LoadingSkeleton, Ul } from '@instana/components';

import {
  CursorPaginatedResult,
  Error,
  EumBeaconByTraceBeacon,
  EumBeaconByTraceBeaconsItem,
  Progress,
  Result,
  TagFilterExpressionElementUnion,
  TimeConfig
} from 'in-types';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import MobileAppScopePath from 'in-alerting/smart-alerts/mobileApp/components/MobileAppScopePath';
import { ImpactedUsersMetricsResult, ExpandedFetchedState } from 'in-eum/hooks/useImpactedUsers';
import WebsiteScopePath from 'in-alerting/smart-alerts/websites/components/WebsiteScopePath';
import AnalyzeImpactedUsersButton from 'in-eum/ImpactedUsers/AnalyzeImpactedUsersButton';
import DescriptionText from 'in-components/form/DescriptionText/DescriptionText';
import { UnifiedMetricsResult } from 'in-subscription/getUnifiedMetrics';
import { all as allProgresses } from 'in-hooks/utils/progress';
import { Col, Row } from 'in-components/layout/Grid';
import { hours } from 'in-services/time';
import { t } from 'in-i18n';

import locals from './ImpactedUsersPresenter.mless';

export interface AdjustedTimeConfig extends TimeConfig {
  reduced: boolean;
}

interface ImpactedUsersPresenterProps {
  adjustedTimeConfig: AdjustedTimeConfig;
  metricImpacts: ImpactedUsersMetricsResult;
  impactedWebsitesOrMobiles?: Result<CursorPaginatedResult<EumBeaconByTraceBeaconsItem>> | null;
  downloadProp: {
    joinFilterForImpactedUsers: TagFilterExpressionElementUnion;
  };
}

export default function ImpactedUsersPresenter({
  adjustedTimeConfig,
  metricImpacts,
  impactedWebsitesOrMobiles,
  downloadProp
}: Readonly<ImpactedUsersPresenterProps>) {
  const { impacted, total } = metricImpacts;

  const overallStatus: {
    progress: Progress;
    pending: boolean;
    errors: Array<Error>;
    impacted: { hasData: boolean; value?: number };
    total: { hasData: boolean; value?: number };
  } = useMemo(() => {
    const progresses: Array<Progress> = [];
    const errors: Array<Error> = [];
    if (impacted?.progress) {
      progresses.push(impacted.progress);
    }
    if (total?.progress) {
      progresses.push(total.progress);
    }
    if (impactedWebsitesOrMobiles?.progress) {
      progresses.push(impactedWebsitesOrMobiles.progress);
    }
    const progress = progresses.length ? allProgresses(...progresses) : null;

    if (impacted?.errors) {
      errors.push(...impacted.errors);
    }
    if (total?.errors) {
      errors.push(...total.errors);
    }
    if (impactedWebsitesOrMobiles?.errors) {
      errors.push(...impactedWebsitesOrMobiles.errors);
    }

    return {
      errors,
      progress: {
        loading: progress ? progress.loading : true,
        percentage: progress?.percentage ? progress.percentage * 100 : undefined
      },
      pending: !!(
        impacted?.state === 'pending' ||
        total?.state === 'pending' ||
        impactedWebsitesOrMobiles?.progress?.loading
      ),
      impacted: getFirstValueFromUnifiedMetric(impacted),
      total: getFirstValueFromUnifiedMetric(total)
    };
  }, [impacted, impactedWebsitesOrMobiles, total]);

  return (
    <>
      {overallStatus.pending && <HorizontalIndicator progress={overallStatus.progress} />}
      <Card title={t('in-eum:titleImpactedUsers')}>
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
            {adjustedTimeConfig.reduced && (
              <span className={locals.duration}>
                (
                {t('in-eum:lastHoursOfTheIssue', {
                  duration: Math.round(adjustedTimeConfig.windowSize / hours.toMillis(1))
                })}
                )
              </span>
            )}
          </Col>
          {impactedWebsitesOrMobiles?.progress?.loading && <LoadingSkeleton className={locals.skeleton} />}
          {!!impactedWebsitesOrMobiles?.data?.items?.length && (
            <Col className={locals.container}>
              <span className={locals.label}>{t('in-eum:entityInfoLabelOfWebsiteOrMobile')}</span>
              <Ul framed={false}>
                {impactedWebsitesOrMobiles.data.items.map(it => (
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
              disabled={overallStatus.pending || !(overallStatus.impacted.hasData && overallStatus.impacted.value)}
              timeConfig={adjustedTimeConfig}
              {...downloadProp}
            />
          </Col>
        </Row>
      </Card>
    </>
  );
}

function getFirstValueFromUnifiedMetric(result?: ExpandedFetchedState<Array<UnifiedMetricsResult>> | null) {
  if (result?.state === 'pending' || !result?.data?.[0]?.values?.[0]?.length) {
    return { hasData: false, value: 0 };
  }

  return { hasData: true, value: result.data[0].values[0][1] ?? 0 };
}

function EumScopePath({ beacon }: { beacon?: EumBeaconByTraceBeacon }) {
  if (beacon?.eumSource === 'web') {
    return <WebsiteScopePath websiteId={beacon.eumCfgId} websiteName={beacon.eumCfgLabel} showDashboardLinks />;
  } else if (beacon?.eumSource === 'mobile') {
    return <MobileAppScopePath mobileAppId={beacon.eumCfgId} mobileAppName={beacon.eumCfgLabel} showDashboardLinks />;
  }

  return <></>;
}
