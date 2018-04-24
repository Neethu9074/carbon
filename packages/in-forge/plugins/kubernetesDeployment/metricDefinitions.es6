import { zeroDecimalPlaces, twoDecimalPlaces, bytesTwoDecimalPlaces, msFormatter } from 'in-services/formatters/number';

export default [
  {
    metrics: ['availableReplicas', 'desiredReplicas'],
    labels: ['Available', 'Desired'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['phase.Pending.count', 'conditions.PodScheduled.False', 'conditions.Ready.False'],
    labels: ['Pending', 'Unscheduled', 'Unready'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['duration'],
    labels: ['Pending phase duration'],
    min: 0,
    formatter: msFormatter
  },
  {
    metrics: ['pods.count'],
    labels: ['Pods'],
    min: 0,
    formatter: zeroDecimalPlaces
  },
  {
    metrics: ['pods.required_mem', 'pods.limit_mem'],
    labels: ['Memory Requests', 'Memory Limits'],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: ['pods.required_cpu', 'pods.limit_cpu'],
    labels: ['CPU Requests', 'CPU Limits'],
    min: 0,
    formatter: twoDecimalPlaces
  },
  {
    metrics: ['pods.required_mem', 'pods.limit_mem'],
    labels: ['Memory Requests', 'Memory Limits'],
    min: 0,
    formatter: bytesTwoDecimalPlaces
  },
  {
    metrics: ['pods.required_cpu', 'pods.limit_cpu'],
    labels: ['CPU Requests', 'CPU Limits'],
    min: 0,
    formatter: twoDecimalPlaces
  }
];
