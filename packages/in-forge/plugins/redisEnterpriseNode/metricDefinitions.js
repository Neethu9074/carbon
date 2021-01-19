/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { bytes, number, micros } from 'in-services/formatters/number';

export default [
  {
    metric: 'total_req',
    label: 'Requests per second',
    formatter: number.compact
  },
  {
    metric: 'avg_latency',
    label: 'Average Latency',
    formatter: micros.detailed
  },
  {
    metric: 'conns',
    label: 'Connections Count',
    formatter: number.compact
  },
  {
    metric: 'cpu_user',
    label: 'CPU User',
    formatter: number.detailed
  },
  {
    metric: 'cpu_system',
    label: 'CPU System',
    formatter: number.detailed
  },
  {
    metric: 'cpu_idle',
    label: 'CPU Idle',
    formatter: number.detailed
  },
  {
    metric: 'free_memory',
    label: 'Free Memory',
    formatter: bytes.detailed
  },
  {
    metric: 'available_memory',
    label: 'Available Memory',
    formatter: bytes.detailed
  },
  {
    metric: 'provisional_memory',
    label: 'Provisional Memory',
    formatter: bytes.detailed
  },
  {
    metric: 'ingress_bytes',
    label: 'Network Ingress Traffic',
    formatter: bytes.perSecond
  },
  {
    metric: 'egress_bytes',
    label: 'Network Egress Traffic',
    formatter: bytes.perSecond
  }
];
