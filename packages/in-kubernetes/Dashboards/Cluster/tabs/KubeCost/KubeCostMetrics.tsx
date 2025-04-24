/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { KubernetesCluster, TimeConfig } from '@instana/types';

import TotalDeploymentCostList from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/TotalDeploymentCostList';
import { KubeCostProps } from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/kubeCostTypeDefinition';
import DeploymentCost from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/DeploymentSpaceCost';
import TotalCostList from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/TotalCostList';
import NamespaceCost from 'in-kubernetes/Dashboards/Cluster/tabs/KubeCost/NameSpaceCost';
import { twoDecimalPlaces, percentage } from 'in-services/formatters/number';
import KpiGridRow from 'in-components/KpiGridRow/KpiGridRow';
import { Row, Col } from 'in-components/layout/Grid';
import KpiCard from 'in-components/KpiCard/KpiCard';
import MetricValue from 'in-components/MetricValue';
import { t } from 'in-i18n';

interface KubeCostMetricsProps {
  kubeCostData: KubeCostProps;
  timeConfig: TimeConfig;
  cluster: KubernetesCluster;
}

export default function KubeCostMetrics({ kubeCostData, timeConfig, cluster }: KubeCostMetricsProps) {
  return (
    <>
      <KpiGridRow sizes={[3, 3, 3, 3]}>
        <KpiCard
          title={t('in-kubernetes:dashboards.kubecost.totalClusterCost')}
          noTooltipOnTitle
          iconAction={{
            icon: 'lib_help_error_info_outline',
            text: t('in-kubernetes:dashboards.kubecost.totalClusterCostTooltipinfo'),
            kind: 'subtle',
            size: 'compact'
          }}
        >
          <MetricValue
            snapshotId={kubeCostData.id}
            metric={'clusterDetails.totalCost'}
            formatter={(d: number) => `${twoDecimalPlaces(d)} ${kubeCostData.currencyCode}`}
          />
        </KpiCard>
        <KpiCard
          title={t('in-kubernetes:dashboards.kubecost.workloadEfficiency')}
          noTooltipOnTitle
          iconAction={{
            icon: 'lib_help_error_info_outline',
            text: t('in-kubernetes:dashboards.kubecost.workloadEfficiencyTooltipinfo'),
            kind: 'subtle',
            size: 'compact'
          }}
        >
          <MetricValue
            snapshotId={kubeCostData.id}
            metric={'clusterDetails.workloadEfficiency'}
            formatter={percentage.detailed}
          />
        </KpiCard>
        <KpiCard
          title={t('in-kubernetes:dashboards.kubecost.estimatedMonthlySavings')}
          noTooltipOnTitle
          iconAction={{
            icon: 'lib_help_error_info_outline',
            text: t('in-kubernetes:dashboards.kubecost.estimatedMonthlySavingsTooltipinfo'),
            kind: 'subtle',
            size: 'compact'
          }}
        >
          <MetricValue
            snapshotId={kubeCostData.id}
            metric={'clusterTotalMonthlySavings.totalMonthlySavings'}
            formatter={(d: number) => `${twoDecimalPlaces(d)} ${kubeCostData.currencyCode}`}
          />
        </KpiCard>
      </KpiGridRow>

      <Row>
        <Col lg={12}>
          <TotalCostList
            currencyCode={kubeCostData.currencyCode}
            url={kubeCostData.url}
            clusterId={cluster.label}
            snapshotId={kubeCostData.id}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <NamespaceCost
            currencyCode={kubeCostData.currencyCode}
            snapshotId={kubeCostData.id}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <TotalDeploymentCostList
            currencyCode={kubeCostData.currencyCode}
            snapshotId={kubeCostData.id}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>
      <Row>
        <Col lg={12}>
          <DeploymentCost
            currencyCode={kubeCostData.currencyCode}
            snapshotId={kubeCostData.id}
            timeConfig={timeConfig}
          />
        </Col>
      </Row>
    </>
  );
}
