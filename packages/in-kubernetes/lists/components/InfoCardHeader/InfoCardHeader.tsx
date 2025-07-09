/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Tooltip, Stack, Typography, Link } from '@instana/components';

import HealthIndicatorButtonPresenter, {
  HealthIndicatorButtonPresenterProps
} from 'in-components/health/HealthIndicatorButtonPresenter';
// @ts-expect-error needs ts migration
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
// @ts-expect-error needs ts migration
import { clusterBadgeName } from 'in-kubernetes/clusterDistributions';
// @ts-expect-error
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import ArgoCDCluster from 'in-kubernetes/Dashboards/ArgoCD/ArgoCDCluster';
import BadgeList from 'in-components/BadgeList/BadgeList';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './InfoCardHeader.mless';

export interface CardHeader {
  id: string;
  title: string;
  icon: string;
  href: string;
  subTitle?: string;
  version?: string;
  distribution?: string;
}

export default function InfoCardHeader({
  id,
  title,
  href,
  icon,
  subTitle = '',
  distribution,
  version
}: Readonly<CardHeader>) {
  const timeConfig = useTimeConfig();
  return (
    <div id={id} className={locals.container}>
      <Stack direction="horizontal" align="center">
        <span className={locals.icon} aria-label={title}>
          <Tooltip content={title} delay={500}>
            <SvgIcon type={icon} />
          </Tooltip>
        </span>
        <Link href={href}>
          <Typography variant="heading-03" noMargin component="h2">
            {title}
          </Typography>
        </Link>
        {subTitle !== '' && (
          <Typography variant="body-compact-01" noMargin component="p">
            <span className={locals.subTitle}>{subTitle}</span>
          </Typography>
        )}
        {version && <BadgeList types={[version]} type={version} getColor={() => 'blue'} />}
        <TypesBadgeList
          type={t('in-kubernetes:dashboards.clusterDistributionBadgeType', {
            clusterDistributionName: clusterBadgeName(distribution)
          })}
        />
        <EntityHealthIndicator
          IndicatorPresenter={(props: Readonly<HealthIndicatorButtonPresenterProps>) => {
            const { maxSeverity, openIssues } = props;
            if (!maxSeverity && !openIssues) {
              return null;
            }
            return <HealthIndicatorButtonPresenter {...props} />;
          }}
          snapshotId={id}
          timeConfig={timeConfig}
        />
        <ArgoCDCluster buttonSize="compact" snapshotId={id} timeConfig={timeConfig} />
      </Stack>
    </div>
  );
}
