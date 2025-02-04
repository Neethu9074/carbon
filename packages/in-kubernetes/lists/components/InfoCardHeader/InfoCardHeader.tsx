/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, Tooltip, Stack, Typography, Link } from '@instana/components';
import { KubernetesCluster } from '@instana/types';
import { themes } from '@instana/design-tokens';

import HealthIndicatorButtonPresenter, {
  HealthIndicatorButtonPresenterProps
} from 'in-components/health/HealthIndicatorButtonPresenter';
// @ts-expect-error needs ts migration
import TypesBadgeList from 'in-kubernetes/Dashboards/commonComponents/TypesBadgeList';
// @ts-expect-error needs ts migration
import { clusterBadgeName } from 'in-kubernetes/clusterDistributions';
import { getIndicatorPresenter } from 'in-kubernetes/Dashboards/commonComponents/DashboardButtonLine';
// @ts-expect-error
import EntityHealthIndicator from 'in-components/EntityHealthIndicator';
import { useClusterDashboard } from 'in-kubernetes/navigation/paths';
import { plugin } from 'in-applications/navigation/matrix';
import BadgeList from 'in-components/BadgeList/BadgeList';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { t } from 'in-i18n';

import locals from './InfoCardHeader.mless';

export default function InfoCardHeader({
  id: clusterId,
  label,
  clusterDistribution = 'kubernetes',
  version
}: KubernetesCluster) {
  const clusterHref = useClusterDashboard(clusterId);
  const timeConfig = useTimeConfig();

  return (
    <div id={clusterId} className={locals.container}>
      <Stack direction="horizontal" align="center">
        <span className={locals.icon} role="img" aria-label={label}>
          <Tooltip content={label} delay={500}>
            <SvgIcon type={`lib_${clusterDistribution}`} />
          </Tooltip>
        </span>
        <Link href={clusterHref}>
          <Typography variant="heading-03" noMargin component="h2">
            {label}
          </Typography>
        </Link>
        {version && (
          <BadgeList types={[version]} type={version} getColor={() => themes.default.ids.color.option.neutral['700']} />
        )}
        <TypesBadgeList
          type={t('in-kubernetes:dashboards.clusterDistributionBadgeType', {
            clusterDistributionName: clusterBadgeName(clusterDistribution)
          })}
        />
        <EntityHealthIndicator
          IndicatorPresenter={(props: HealthIndicatorButtonPresenterProps) => (
            <HealthIndicatorButtonPresenter {...getIndicatorPresenter({ plugin, ...props })} />
          )}
          snapshotId={clusterId}
          timeConfig={timeConfig}
        />
      </Stack>
    </div>
  );
}
