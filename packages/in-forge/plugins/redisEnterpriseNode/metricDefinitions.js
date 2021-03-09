/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, micros } from 'in-services/formatters/number';
import { t } from 'in-i18n';

export default [
  {
    metric: 'total_req',
    label: t('in-forge:plugins.redisEnterpriseNode.requestsPerSecond'),
    formatter: number.compact
  },
  {
    metric: 'avg_latency',
    label: t('in-forge:plugins.redisEnterpriseNode.averageLatency'),
    formatter: micros.detailed
  },
  {
    metric: 'conns',
    label: t('in-forge:plugins.redisEnterpriseNode.connectionsCount'),
    formatter: number.compact
  },
  {
    metric: 'cpu_user',
    label: t('in-forge:plugins.redisEnterpriseNode.cpuUser'),
    formatter: number.detailed
  },
  {
    metric: 'cpu_system',
    label: t('in-forge:plugins.redisEnterpriseNode.cpuSystem'),
    formatter: number.detailed
  },
  {
    metric: 'cpu_idle',
    label: t('in-forge:plugins.redisEnterpriseNode.cpuIdle'),
    formatter: number.detailed
  },
  {
    metric: 'free_memory',
    label: t('in-forge:plugins.redisEnterpriseNode.freeMemory'),
    formatter: bytes.detailed
  },
  {
    metric: 'available_memory',
    label: t('in-forge:plugins.redisEnterpriseNode.availableMemory'),
    formatter: bytes.detailed
  },
  {
    metric: 'provisional_memory',
    label: t('in-forge:plugins.redisEnterpriseNode.provisionalMemory'),
    formatter: bytes.detailed
  },
  {
    metric: 'ingress_bytes',
    label: t('in-forge:plugins.redisEnterpriseNode.networkIngressTraffic'),
    formatter: bytes.perSecond
  },
  {
    metric: 'egress_bytes',
    label: t('in-forge:plugins.redisEnterpriseNode.networkEgressTraffic'),
    formatter: bytes.perSecond
  }
];
